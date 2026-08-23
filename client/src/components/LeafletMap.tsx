import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { cn } from "@/lib/utils";

// Fix default marker icons (Vite/bundler breaks Leaflet's default asset paths)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface LeafletMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

interface LeafletMapProps {
  className?: string;
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: LeafletMarker[];
  heightClassName?: string;
}

// Leaflet computes its tile grid from the container's size at mount time.
// If the container is inside a conditional block or a layout that settles
// after mount, the map can render with a stale (often zero) size, leaving
// the tiles blank. Forcing a resize check after mount and on updates fixes it.
function MapResizeFix({ dependency }: { dependency: string }) {
  const map = useMap();

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timeout);
  }, [map, dependency]);

  return null;
}

export function LeafletMap({
  className,
  center,
  zoom = 13,
  markers = [],
  heightClassName = "h-[400px]",
}: LeafletMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={cn("w-full rounded-lg", heightClassName, className)}
    >
      <MapResizeFix
        dependency={`${center.lat},${center.lng},${markers.length}`}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(m => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
