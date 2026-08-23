import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
