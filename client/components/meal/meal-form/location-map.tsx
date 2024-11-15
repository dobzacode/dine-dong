'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { useLogger } from 'next-axiom';
import { useEffect, useMemo } from 'react';

export default function LocationMap({ lat = 48.8738, lng = 2.295 }: { lat: number; lng: number }) {
  const log = useLogger();
  const mapCenter = useMemo(() => ({ lat: lat || 48.8738, lng: lng || 2.295 }), [lat, lng]);

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

  if (!key) {
    log.info('Google Maps API key is missing');
    console.log('Google Maps API key is missing');
  }

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: key
  });

  useEffect(() => {
    console.log(`Map Updated to center: ${lat}, ${lng}`);
  }, [lat, lng]);

  if (!isLoaded) {
    return <Skeleton className="aspect-square w-full rounded-sm" />;
  }

  return (
    <GoogleMap
      options={mapOptions}
      zoom={14}
      center={mapCenter}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapContainerStyle={{ width: 'full', height: 'auto', aspectRatio: 1, borderRadius: '8px' }}
      onLoad={() => console.log('Map Component Loaded...')}
    >
      <MarkerF position={mapCenter} onLoad={() => console.log('Marker Loaded')} />
    </GoogleMap>
  );
}
