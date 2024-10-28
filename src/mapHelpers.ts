import { MarkerData, UserAction } from './types';

export const getMarkerIcon = (marker: MarkerData) => {
  if (marker.number >= 3) {
    return {
      url: 'path/to/custom/icon.png',
      scaledSize: new google.maps.Size(30, 30),
    };
  }

  return {
    url: 'path/to/default/icon.png',
    scaledSize: new google.maps.Size(30, 30),
  };
};

export const logUserAction = (action: UserAction) => {
  fetch('/api/user-actions', {
    method: 'POST',
    body: JSON.stringify(action),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const handleNextMarker = (
  activeMarkerId: string | null,
  markers: MarkerData[],
) => {
  if (!activeMarkerId) return null;
  const currentIndex = markers.findIndex(
    marker => marker.id === activeMarkerId,
  );
  const nextIndex = (currentIndex + 1) % markers.length;

  return markers[nextIndex].id;
};

export const handlePreviousMarker = (
  activeMarkerId: string | null,
  markers: MarkerData[],
) => {
  if (!activeMarkerId) return null;
  const currentIndex = markers.findIndex(
    marker => marker.id === activeMarkerId,
  );
  const prevIndex = (currentIndex - 1 + markers.length) % markers.length;

  return markers[prevIndex].id;
};
