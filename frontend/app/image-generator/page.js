"use client";
import { useState } from "react";
import axios from "axios";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/images/generate", // Manually set API URL
        { prompt }
      );

      setImageUrl(response.data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">AI Image Generator</h1>
      <input
        type="text"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-lg p-2 border rounded-md mb-4"
      />
      <button
        onClick={handleGenerateImage}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Generated Image:</h2>
          <img
            src={imageUrl}
            alt="Generated"
            className="mt-2 rounded-lg shadow-md w-96"
          />
        </div>
      )}
    </div>
  );
}
