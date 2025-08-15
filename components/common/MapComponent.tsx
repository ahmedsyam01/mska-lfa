import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation } from '../../src/types';

// Fix for default markers in React Leaflet
import L from 'leaflet';

// Configure default icon with string URLs
const DefaultIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different types
const celebrityIcon = new Icon({
  iconUrl: '/icons/celebrity-marker.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [30, 30],
  shadowAnchor: [10, 30]
});

const reportIcon = new Icon({
  iconUrl: '/icons/report-marker.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [25, 25],
  shadowAnchor: [8, 25]
});

const newsIcon = new Icon({
  iconUrl: '/icons/news-marker.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [28, 28],
  shadowAnchor: [9, 28]
});

interface MapComponentProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationClick?: (location: MapLocation) => void;
  showControls?: boolean;
  showSearch?: boolean;
  className?: string;
}

// Component to fit bounds when locations change
const FitBounds: React.FC<{ locations: MapLocation[] }> = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = new LatLngBounds(
        locations.map(location => [location.latitude, location.longitude])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [locations, map]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  center = [20.0, 0.0], // Default center on Mauritania
  zoom = 6,
  height = '400px',
  onLocationClick,
  showControls = true,
  showSearch = false,
  className = ''
}) => {
  const mapRef = useRef<L.Map | null>(null);

  const getIcon = (type: string): Icon => {
    switch (type) {
      case 'celebrity':
        return celebrityIcon;
      case 'report':
        return reportIcon;
      case 'news':
        return newsIcon;
      default:
        return DefaultIcon;
    }
  };

  const handleMarkerClick = (location: MapLocation) => {
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const getBadgeColor = (type: string): string => {
    switch (type) {
      case 'celebrity':
        return 'bg-purple-100 text-purple-800';
      case 'report':
        return 'bg-blue-100 text-blue-800';
      case 'news':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.length > 0 && <FitBounds locations={locations} />}
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={getIcon(location.type)}
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(location.type)}`}>
                    {location.type}
                  </span>
                </div>
                
                {location.imageUrl && (
                  <img
                    src={location.imageUrl}
                    alt={location.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                )}
                
                {location.description && (
                  <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                )}
                
                {location.category && (
                  <p className="text-xs text-gray-500 mb-1">
                    <strong>Category:</strong> {location.category}
                  </p>
                )}
                
                {location.verified && (
                  <div className="flex items-center text-xs text-green-600">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {showControls && (
        <div className="absolute top-4 right-4 z-1000">
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Celebrities</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Reports</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>News</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showSearch && (
        <div className="absolute top-4 left-4 z-1000">
          <div className="bg-white rounded-lg shadow-lg p-2">
            <input
              type="text"
              placeholder="Search locations..."
              className="w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 