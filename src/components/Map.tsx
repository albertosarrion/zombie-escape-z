"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(m => m.Circle), { ssr: false });

export default function GPSMap() {
  const location = useGeolocation(true);
  const [mapIcon, setMapIcon] = useState<any>(null);
  const [simulatedLocation, setSimulatedLocation] = useState<{lat: number, lng: number, accuracy: number} | null>(null);

  useEffect(() => {
    const L = require("leaflet");
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<div style='background-color:#39ff14; width:15px; height:15px; border-radius:50%; box-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14;'></div>",
      iconSize: [15, 15],
      iconAnchor: [7.5, 7.5],
    });
    setMapIcon(customIcon);
  }, []);

  const handleSimulateTarget = () => {
    // Puerta del Sol, Madrid as a simulated fallback coordinate
    setSimulatedLocation({
      lat: 40.4168,
      lng: -3.7038,
      accuracy: 25
    });
  };

  if (!location.loaded && !simulatedLocation) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a] border border-zombie-border rounded-lg text-zombie-neon">
        ACQUIRING SATELLITE SIGNAL...
      </div>
    );
  }

  // If we have an error and we are NOT simulating yet, show error with fallback button
  if (location.error && !simulatedLocation) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#1a0505] p-6 text-center z-10">
        <span className="text-zombie-red font-bold text-xl mb-2">GPS SIGNAL BLOCKED</span>
        <span className="text-zombie-muted text-sm max-w-sm mb-6">
          Your browser (Opera/Brave/Edge) is hard-blocking location requests. 
          Enable it in your browser settings or use the simulated relay for testing.
        </span>
        <button 
          onClick={handleSimulateTarget}
          className="px-6 py-2 bg-zombie-card border border-zombie-neon text-zombie-neon hover:bg-zombie-neon hover:text-black transition-colors rounded text-sm font-bold"
        >
          ACTIVATE SIMULATOR (MADRID)
        </button>
      </div>
    );
  }

  // Use simulation if activated, otherwise real GPS
  const activeLat = simulatedLocation ? simulatedLocation.lat : location.coordinates.lat;
  const activeLng = simulatedLocation ? simulatedLocation.lng : location.coordinates.lng;
  const activeAcc = simulatedLocation ? simulatedLocation.accuracy : location.coordinates.accuracy;
  const isSimulated = !!simulatedLocation;

  const position: [number, number] = [activeLat, activeLng];

  return (
    <div className="relative h-full w-full z-0 bg-[#0a0a0a]">
      <MapContainer 
        center={position} 
        zoom={18} 
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
                <div className="text-center font-bold text-black">
                  {isSimulated ? "SIMULATED SURVIVOR" : "SURVIVOR LOCATION"}
                </div>
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
      </MapContainer>
      
      {/* Overlay HUD */}
      <div className="absolute top-4 right-4 z-[400] bg-black/80 border border-zombie-border rounded p-2 text-xs text-zombie-neon font-mono shadow-lg text-right">
        {isSimulated && <div className="text-zombie-red font-bold mb-1">SIMULATED OVERRIDE</div>}
        LAT: {activeLat.toFixed(5)}<br/>
        LNG: {activeLng.toFixed(5)}<br/>
        {activeAcc && <>ERR: ±{Math.round(activeAcc)}m</>}
      </div>
    </div>
  );
}
