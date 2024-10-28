import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MarkerData, UserAction } from './types';
import {
  getMarkerIcon,
  logUserAction,
  handleNextMarker,
  handlePreviousMarker,
} from './mapHelpers';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 48.3794,
  lng: 31.1656,
};

const MyMapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerClustererRef = useRef<MarkerClusterer | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(7);

  const currentUserId = 'user123';

  useEffect(() => {
    const savedMarkers = localStorage.getItem('markers');

    if (savedMarkers) {
      setMarkers(JSON.parse(savedMarkers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  const addMarker = (markerData: MarkerData): void => {
    const existingMarker = markers.find(
      marker => marker.questNumber === markerData.questNumber,
    );

    if (existingMarker) {
      return;
    }

    setMarkers(prevMarkers => [...prevMarkers, markerData]);

    const action: UserAction = {
      actionType: 'add',
      userId: currentUserId,
      timestamp: Date.now(),
      markerId: markerData.id,
    };

    logUserAction(action);
  };

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const maxNumber =
          markers.length > 0
            ? Math.max(...markers.map(marker => marker.number))
            : 0;

        const newMarker: MarkerData = {
          id: uuidv4(),
          questNumber: `Quest ${maxNumber + 1}`,
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          },
          number: maxNumber + 1,
          timestamp: Date.now(),
          nextMarkerId:
            markers.length > 0 ? markers[markers.length - 1].id : null,
        };

        addMarker(newMarker);
      }
    },
    [markers],
  );

  const handleMarkerClick = (id: string) => {
    setActiveMarkerId(activeMarkerId === id ? null : id);
  };

  useEffect(() => {
    if (googleMapRef.current && markers.length) {
      const map = googleMapRef.current;

      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
      }

      const markerObjects = markers.map(marker => {
        const customMarker = new google.maps.Marker({
          position: marker.position,
          icon: getMarkerIcon(marker),
        });

        customMarker.addListener('click', () => {
          handleMarkerClick(marker.id);
        });

        return customMarker;
      });

      markerClustererRef.current = new MarkerClusterer({
        map,
        markers: markerObjects,
      });
    }
  }, [markers]);

  const handleDeleteMarker = (id: string) => {
    setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id));
    if (activeMarkerId === id) {
      setActiveMarkerId(null);
      setInfoWindowPosition(null);
    }
  };

  const handleDeleteAllMarkers = () => {
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    setMarkers([]);
    setActiveMarkerId(null);
    setInfoWindowPosition(null);
  };

  const handleZoomChanged = () => {
    if (googleMapRef.current) {
      const map = googleMapRef.current;
      const zoom = map.getZoom();

      if (zoom !== undefined) {
        setZoomLevel(zoom);
      }
    }
  };

  const handleMarkerDragEnd = (
    id: string,
    event: google.maps.MapMouseEvent,
  ) => {
    const latLng = event.latLng;

    if (latLng) {
      setMarkers(prevMarkers =>
        prevMarkers.map(marker =>
          marker.id === id
            ? {
                ...marker,
                position: {
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                },
              }
            : marker,
        ),
      );
    }
  };

  useEffect(() => {
    if (activeMarkerId) {
      const foundMarker = markers.find(m => m.id === activeMarkerId);

      if (foundMarker && googleMapRef.current) {
        const projection = googleMapRef.current.getProjection();

        if (projection) {
          const position = projection.fromLatLngToPoint(foundMarker.position);

          if (position) {
            setInfoWindowPosition({ x: position.x, y: position.y });
          }
        }
      }
    }
  }, [activeMarkerId, markers]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBKuYzLO9HRYNQDf4c64fsLPHgizSkhQW0">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoomLevel}
        onClick={handleMapClick}
        options={{ draggable: true }}
        onLoad={map => {
          googleMapRef.current = map;
          googleMapRef.current.addListener('zoom_changed', handleZoomChanged);
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            draggable={true}
            onClick={() => handleMarkerClick(marker.id)}
            onDragEnd={event => handleMarkerDragEnd(marker.id, event)}
            label={{
              text: String(marker.number),
              color: marker.id === activeMarkerId ? 'black' : 'white',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          />
        ))}
        {activeMarkerId && (
          <div
            style={{
              position: 'absolute',
              right: `${infoWindowPosition?.x}px`,
              top: `${infoWindowPosition?.y}px`,
              transform: 'translate(-10%, -20%)',
              backgroundColor: 'white',
              padding: '8px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              zIndex: 8,
            }}
          >
            <p>
              Marker number:{' '}
              {
                markers.find(marker => marker.id === activeMarkerId)
                  ?.questNumber
              }
            </p>
            <p>
              Latitude:{' '}
              {
                markers.find(marker => marker.id === activeMarkerId)?.position
                  .lat
              }
            </p>
            <p>
              Longitude:{' '}
              {
                markers.find(marker => marker.id === activeMarkerId)?.position
                  .lng
              }
            </p>
            <p>
              Time of creation:{' '}
              {markers.find(marker => marker.id === activeMarkerId)
                ?.timestamp !== undefined
                ? new Date(
                    markers.find(
                      marker => marker.id === activeMarkerId,
                    )!.timestamp,
                  ).toLocaleString()
                : 'N/A'}
            </p>
            <p>
              ID of the next marker:{' '}
              {
                markers.find(marker => marker.id === activeMarkerId)
                  ?.nextMarkerId
              }
            </p>
            <button
              onClick={() => handleDeleteMarker(activeMarkerId!)}
              style={{
                marginTop: '8px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Delete Marker
            </button>

            <button
              onClick={() => setActiveMarkerId(null)}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        )}
      </GoogleMap>
      <div style={{ position: 'absolute', top: 40, left: 20 }}>
        <button onClick={handleDeleteAllMarkers} className="rounded-button">
          Delete all markers
        </button>
        <button
          onClick={() => {
            const prevMarkerId = handlePreviousMarker(activeMarkerId, markers);
            if (prevMarkerId) {
              setActiveMarkerId(prevMarkerId);
            }
          }}
          className="rounded-button"
          style={{ marginLeft: '10px' }}
        >
          Previous Marker
        </button>

        <button
          onClick={() => {
            const nextMarkerId = handleNextMarker(activeMarkerId, markers);
            if (nextMarkerId) {
              setActiveMarkerId(nextMarkerId);
            }
          }}
          className="rounded-button"
          style={{ marginLeft: '10px' }}
        >
          Next Marker
        </button>
      </div>
    </LoadScript>
  );
};

export default MyMapComponent;
