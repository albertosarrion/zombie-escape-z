import { useState, useEffect } from 'react';

export interface GeolocationState {
  loaded: boolean;
  coordinates: {
    lat: number;
    lng: number;
    altitude?: number | null;
    accuracy?: number;
    heading?: number | null;
    speed?: number | null;
  };
  error: {
    code: number;
    message: string;
  } | null;
  timestamp: number | null;
}

export function useGeolocation(enableHighAccuracy = true) {
  const [location, setLocation] = useState<GeolocationState>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
    error: null,
    timestamp: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((state) => ({
        ...state,
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported by this browser.",
        },
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        },
        error: null,
        timestamp: position.timestamp,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setLocation((state) => ({
        ...state,
        loaded: true,
        error: {
          code: error.code,
          message: error.message,
        },
      }));
    };

    // Watch position to update constantly as the player moves (GPS tracking)
    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [enableHighAccuracy]);

  return location;
}
