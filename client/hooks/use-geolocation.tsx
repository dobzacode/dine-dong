'use client';

import { useEffect, useState } from 'react';

export function useGeoLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        console.log(coords);
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  return location;
}
