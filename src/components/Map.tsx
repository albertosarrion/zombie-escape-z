"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { createClient } from "@/lib/supabase/client";
// Define Waypoint type
type Waypoint = {
  id: string;
  name: string;
  description: string;
  type: "danger" | "safehouse" | "objective" | "info";
  coordinates: { lat: number; lng: number };
};
// Removed mock data import; waypoints will be loaded from Supabase

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(m => m.Circle), { ssr: false });

export default function GPSMap() {
  const location = useGeolocation(true);
  const [mapIcon, setMapIcon] = useState<any>(null);
  const [waypointIcons, setWaypointIcons] = useState<Record<string, any> | null>(null);
  const [memberIcon, setMemberIcon] = useState<any>(null);
  const [simulatedLocation, setSimulatedLocation] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const L = require("leaflet");
    
    // Survivor Icon (Self)
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#39ff14; width:15px; height:15px; border-radius:50%; box-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14;'></div>",
      iconSize: [15, 15],
      iconAnchor: [7.5, 7.5],
    });
    setMapIcon(customIcon);

    // Member Icon (Squad)
    const mIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#0055ff; width:12px; height:12px; border-radius:50%; box-shadow: 0 0 8px #0055ff;'></div>",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    setMemberIcon(mIcon);

    // Waypoint Icons
    const dangerIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#000; color:#ff0000; border: 2px solid #ff0000; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size: 16px; box-shadow: 0 0 10px #ff0000;'>💀</div>",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const safehouseIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#000; color:#0055ff; border: 2px solid #0055ff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size: 16px; box-shadow: 0 0 10px #0055ff;'>🛡️</div>",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const objectiveIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#000; color:#ffd700; border: 2px solid #ffd700; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size: 16px; box-shadow: 0 0 10px #ffd700;'>🎯</div>",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const infoIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#000; color:#ffffff; border: 2px solid #ffffff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size: 16px;'>ℹ️</div>",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    setWaypointIcons({
      danger: dangerIcon,
      safehouse: safehouseIcon,
      objective: objectiveIcon,
      info: infoIcon
    });

    const supabase = createClient();

    // Fetch User, Waypoints and Team
    const initMap = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Fetch Profile to get team_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .single();

        if (profile?.team_id) {
          // Initial fetch of team members
          const { data: members } = await supabase
            .from('profiles')
            .select('id, full_name, last_location_lat, last_location_lng, is_alive')
            .eq('team_id', profile.team_id)
            .neq('id', user.id); // Don't show self as a "member" (already shown as mapIcon)
          
          setTeamMembers(members || []);

          // Subscribe to profile changes for team members
          const channel = supabase
            .channel('team_locations')
            .on('postgres_changes', { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'profiles',
              filter: `team_id=eq.${profile.team_id}` 
            }, (payload) => {
              if (payload.new.id !== user.id) {
                setTeamMembers(current => 
                  current.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m)
                );
              }
            })
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };
        }
      }

      const { data: waypointData } = await supabase.from('waypoints').select('*');
      const transformed = (waypointData as any[] || []).map((wp) => ({
        id: wp.id,
        name: wp.name,
        description: wp.description,
        type: wp.type as "danger" | "safehouse" | "objective" | "info",
        coordinates: { lat: wp.lat, lng: wp.lng },
      }));
      setWaypoints(transformed);
    };

    initMap();
  }, []);

  // Sync user location to Supabase
  useEffect(() => {
    if (!userId || (!location.coordinates.lat && !simulatedLocation?.lat)) return;

    const lat = simulatedLocation ? simulatedLocation.lat : location.coordinates.lat;
    const lng = simulatedLocation ? simulatedLocation.lng : location.coordinates.lng;

    const syncLocation = async () => {
      const supabase = createClient();
      await supabase
        .from('profiles')
        .update({ 
          last_location_lat: lat, 
          last_location_lng: lng,
          last_active: new Date().toISOString()
        })
        .eq('id', userId);
    };

    // Debounce potential high-frequency GPS updates
    const timer = setTimeout(syncLocation, 5000); 
    return () => clearTimeout(timer);
  }, [location.coordinates.lat, location.coordinates.lng, simulatedLocation, userId]);

  const handleSimulateTarget = () => {
    setSimulatedLocation({
      lat: 40.4168,
      lng: -3.7038,
      accuracy: 25
    });
  };

  if (!location.loaded && !simulatedLocation) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a] border border-zombie-border rounded-lg text-zombie-neon">
        ADQUIRIENDO SEÑAL SATELITAL...
      </div>
    );
  }

  if (location.error && !simulatedLocation) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#1a0505] p-6 text-center z-10">
        <span className="text-zombie-red font-bold text-xl mb-2">SEÑAL GPS BLOQUEADA</span>
        <span className="text-zombie-muted text-sm max-w-sm mb-6">
          Tu navegador está bloqueando las peticiones de ubicación. 
        </span>
        <button 
          onClick={handleSimulateTarget}
          className="px-6 py-2 bg-zombie-card border border-zombie-neon text-zombie-neon hover:bg-zombie-neon hover:text-black transition-colors rounded text-sm font-bold uppercase"
        >
          ACTIVAR SIMULADOR (MADRID)
        </button>
      </div>
    );
  }

  const activeLat = simulatedLocation ? simulatedLocation.lat : location.coordinates.lat;
  const activeLng = simulatedLocation ? simulatedLocation.lng : location.coordinates.lng;
  const activeAcc = simulatedLocation ? simulatedLocation.accuracy : location.coordinates.accuracy;
  const isSimulated = !!simulatedLocation;

  const position: [number, number] = [activeLat, activeLng];

  const waypointColors = {
    danger: "text-zombie-red",
    safehouse: "text-[#0055ff]",
    objective: "text-[#ffd700]",
    info: "text-white"
  };

  return (
    <div className="relative h-full w-full z-0 bg-[#0a0a0a]">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {mapIcon && (
          <>
            <Marker position={position} icon={mapIcon}>
              <Popup>
                <div className="text-center font-bold text-black border-b border-gray-300 pb-1 mb-1 uppercase text-xs">
                  {isSimulated ? "Sujeto Simulado" : "Tú (Superviviente)"}
                </div>
                <div className="text-[10px] text-gray-700 font-mono">SEÑAL ACTIVA</div>
              </Popup>
            </Marker>
            
            {activeAcc && (
              <Circle 
                center={position} 
                radius={activeAcc} 
                pathOptions={{ color: '#39ff14', fillColor: '#39ff14', fillOpacity: 0.1, weight: 1 }} 
              />
            )}
          </>
        )}

        {/* Render Team Members */}
        {memberIcon && teamMembers.map((member) => (
          member.last_location_lat && member.last_location_lng && (
            <Marker 
              key={member.id} 
              position={[member.last_location_lat, member.last_location_lng]} 
              icon={memberIcon}
            >
              <Popup>
                <div className="bg-[#0a0a0a] text-white p-1">
                  <div className={`font-bold text-xs ${member.is_alive ? "text-[#0055ff]" : "text-zombie-red"}`}>
                    {member.full_name}
                  </div>
                  <div className="text-[10px] text-zombie-muted">
                    {member.is_alive ? "SEÑAL VIVA" : "SEÑAL PERDIDA"}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Render Waypoints */}
        {waypointIcons && waypoints.map((wp) => (
          <Marker
            key={wp.id}
            position={[wp.coordinates.lat, wp.coordinates.lng]}
            icon={waypointIcons[wp.type]}
          >
            <Popup className="zombie-poi-popup">
              <div className="bg-[#0a0a0a] text-white p-2 min-w-[200px]">
                <div className={`font-bold border-b border-zombie-border pb-2 mb-2 uppercase ${waypointColors[wp.type]}`}>
                  {wp.name}
                </div>
                <div className="text-xs text-zombie-muted leading-relaxed">
                  {wp.description}
                </div>
                <div className="mt-3 text-[10px] text-zombie-border mono text-right">
                  ID: {wp.id} | T: {wp.type.toUpperCase()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay HUD */}
      <div className="absolute top-4 right-4 z-[400] bg-black/80 border border-zombie-border rounded p-2 text-xs text-zombie-neon font-mono shadow-lg text-right">
        {isSimulated && <div className="text-zombie-red font-bold mb-1">ANULACIÓN SIMULADA</div>}
        LAT: {activeLat.toFixed(5)}<br/>
        LNG: {activeLng.toFixed(5)}<br/>
        {activeAcc && <>ERR: ±{Math.round(activeAcc)}m</>}
      </div>
    </div>
  );
}
