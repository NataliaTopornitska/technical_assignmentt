import React from 'react';
import { addMarker } from './markerService';

const MarkerComponent = () => {
  const handleMapClick = (event) => {
    const markerData = {
      location: {
        lat: event.lat,
        lng: event.lng
      },
      timestamp: new Date(),
      markerNumber: 1,
      nextMarkerId: null
    };

    addMarker(markerData);
  };

  return (
    <div onClick={handleMapClick}>
      Click on the map to add a marker
    </div>
  );
};

export default MarkerComponent;
