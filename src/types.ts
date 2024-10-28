export interface MarkerData {
  id: string;
  questNumber: string;
  position: google.maps.LatLngLiteral;
  number: number;
  timestamp: number;
  nextMarkerId: string | null;
}

export interface UserAction {
  actionType: 'add' | 'remove' | 'move';
  userId: string;
  timestamp: number;
  markerId: string;
  position?: { lat: number; lng: number };
}
