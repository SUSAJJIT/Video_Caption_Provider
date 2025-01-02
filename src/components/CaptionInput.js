import React, { useState } from "react";

const CaptionInput = ({ addCaption }) => {
  const [captionText, setCaptionText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addCaption({ text: captionText, startTime: parseFloat(startTime), endTime: parseFloat(endTime) });
    setCaptionText("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mt-4">
      <input
        type="text"
        placeholder="Caption text"
        value={captionText}
        onChange={(e) => setCaptionText(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        required
      />
      <input
        type="number"
        placeholder="Start time (seconds)"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        required
      />
      <input
        type="number"
        placeholder="End time (seconds)"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">
        Add Caption
      </button>
    </form>
  );
};

export default CaptionInput;
