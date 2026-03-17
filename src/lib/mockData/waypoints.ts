export type WaypointType = "danger" | "safehouse" | "objective" | "info";

export interface Waypoint {
  id: string;
  name: string;
  description: string;
  type: WaypointType;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// These are mocked waypoints near the simulated location (Puerta del Sol, Madrid)
// When Supabase is connected, we will fetch these from the database instead.
export const mockWaypoints: Waypoint[] = [
  {
    id: "wp-001",
    name: "Cementerio Abandonado",
    description: "Zona de alta actividad infectada. Se recomienda evitar el perímetro a menos que sea estrictamente necesario.",
    type: "danger",
    coordinates: {
      lat: 40.4150,
      lng: -3.7050,
    },
  },
  {
    id: "wp-002",
    name: "Refugio 13",
    description: "Zona segura establecida por la resistencia. Contiene suministros médicos y munición limitada.",
    type: "safehouse",
    coordinates: {
      lat: 40.4180,
      lng: -3.7010,
    },
  },
  {
    id: "wp-003",
    name: "Antena de Comunicaciones",
    description: "Objetivo principal: Reactivar el relé para contactar con los equipos de extracción.",
    type: "objective",
    coordinates: {
      lat: 40.4195,
      lng: -3.7065,
    },
  }
];
