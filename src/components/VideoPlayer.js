import React from "react";

const VideoPlayer = ({ videoUrl, captions }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <video id="video-player" controls className="w-full">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-10 left-0 right-0 text-center text-white text-lg bg-black bg-opacity-50 p-2">
        {captions.map((caption, index) => (
          <p
            key={index}
            className="caption"
            style={{
              display:
                caption.startTime <=
                  document.getElementById("video-player")?.currentTime &&
                caption.endTime >=
                  document.getElementById("video-player")?.currentTime
                  ? "block"
                  : "none",
            }}
          >
            {caption.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
