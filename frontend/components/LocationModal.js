"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationSelector({ onSelect }) {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });
  return position && <Marker position={position} />;
}

export default function LocationModal({
  isOpen,
  onRequestClose,
  onLocationSelect,
}) {
  // Set app element to prevent screen reader issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      } else {
        console.warn("App element #__next not found");
      }
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Location"
      ariaHideApp={false} // not recommended for production
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
