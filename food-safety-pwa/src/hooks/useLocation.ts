import { useEffect, useState } from 'react';

export const useLocation = () => {
  const [location] = useState<{ state: string; country: string }>({
    state: 'Telangana', // Default for this market
    country: 'India'
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Simple reverse geocoding proxy - in real app use an API
            console.log(`User location: ${latitude}, ${longitude}`);
            // Let's assume we mapped it to Telangana for the demo
          } catch (error) {
            console.error('Geo error:', error);
          }
        }
      );
    }
  }, []);

  return location;
};
