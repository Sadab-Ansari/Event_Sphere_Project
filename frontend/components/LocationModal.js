"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamically load react-leaflet components on client only
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Wrapper for useMapEvents (avoids SSR issues)
function MapEvents({ onClick }) {
  // require here so it only runs on client
  const { useMapEvents } = require("react-leaflet");
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function LocationSelector({ onSelect }) {
  const [position, setPosition] = useState(null);

  return (
    <>
      <MapEvents
        onClick={(latlng) => {
          setPosition(latlng);
          onSelect(latlng);
        }}
      />
      {position && <Marker position={position} />}
    </>
  );
}

export default function LocationModal({
  isOpen,
  onRequestClose,
  onLocationSelect,
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  //  Prevent rendering on server
  if (!isClient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Location"
      ariaHideApp={false}
    >
      <h2>Select Event Location</h2>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationSelector
          onSelect={(latlng) => {
            onLocationSelect(`${latlng.lat}, ${latlng.lng}`);
            onRequestClose();
          }}
        />
      </MapContainer>
      <button
        onClick={onRequestClose}
        className="mt-2 bg-red-600 px-4 py-2 rounded text-white"
      >
        Cancel
      </button>
    </Modal>
  );
}
