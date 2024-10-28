import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

interface MarkerData {
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  markerNumber: number;
  nextMarkerId: string | null;
}

export const addMarker = async (
  markerData: MarkerData,
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'markers'), markerData);

    return docRef.id;
  } catch (e) {
    return null;
  }
};
