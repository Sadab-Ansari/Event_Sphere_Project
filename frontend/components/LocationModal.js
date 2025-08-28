"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

export default function LocationModal({
  isOpen,
  onRequestClose,
  onLocationSelect,
}) {
  useEffect(() => {
    if (!isOpen) return;

    let mapInstance;

    (async () => {
      const leaflet = await import("leaflet");

      // Create map
      mapInstance = leaflet.map("map").setView([28.6139, 77.209], 5);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(mapInstance);

      // Click handler
      mapInstance.on("click", (e) => {
        const coords = `${e.latlng.lat}, ${e.latlng.lng}`;
        onLocationSelect(coords);
        onRequestClose();
      });

      // Fix tiles not rendering
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 500);
    })();

    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, [isOpen, onLocationSelect, onRequestClose]);

  if (!isOpen) return null; // ✅ don't render until opened

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-4 text-black">
        <h2 className="text-lg font-semibold mb-3">Select Event Location</h2>

        {/* Map */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow">
          <div id="map" className="w-full h-full"></div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onRequestClose} variant="destructive">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
