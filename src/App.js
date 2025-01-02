import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [videoURL, setVideoURL] = useState("");
  const [captions, setCaptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentCaption, setCurrentCaption] = useState("");
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [captionTimeout, setCaptionTimeout] = useState(null);

  const playerRef = useRef(null);

  const isValidURL = (url) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.protocol === "http:" || parsedURL.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const getYouTubeEmbedURL = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
      const videoID = urlObj.searchParams.get("v") || urlObj.pathname.split("/")[1];
      return `https://www.youtube.com/embed/${videoID}`;
    }
    return url;
  };

  const handleURLSubmit = () => {
    if (!isValidURL(videoURL)) {
      setErrorMessage("Please enter a valid video URL (e.g., YouTube or hosted video links).");
      return;
    }
    setErrorMessage("");
    const embedURL = getYouTubeEmbedURL(videoURL);
    setVideoURL(embedURL);
    loadYouTubeAPI(embedURL);
  };

  const loadYouTubeAPI = (embedURL) => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onload = () => {
        window.onYouTubeIframeAPIReady = () => {
          createPlayer(embedURL);
        };
      };
      document.body.appendChild(script);
    } else {
      createPlayer(embedURL);
    }
  };

  const createPlayer = (embedURL) => {
    const ytPlayer = new window.YT.Player("video-player", {
      videoId: embedURL.split("/embed/")[1],
      events: {
        onReady: (event) => setPlayer(event.target),
        onStateChange: handlePlayerStateChange,
      },
    });
    playerRef.current = ytPlayer;
  };

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const addCaption = (timestamp, text) => {
    setCaptions([...captions, { timestamp, text }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        const currentTime = player.getCurrentTime();
        const matchingCaption = captions.find(
          (caption, index) => {
            const nextCaptionTime = captions[index + 1]
              ? parseTimestamp(captions[index + 1].timestamp)
              : currentTime + 10;
            return (
              Math.floor(currentTime) >= parseTimestamp(caption.timestamp) &&
              Math.floor(currentTime) < nextCaptionTime
            );
          }
        );

        if (matchingCaption) {
          setCurrentCaption(matchingCaption.text);
          clearTimeout(captionTimeout);
        } else {
          setCaptionTimeout(
            setTimeout(() => setCurrentCaption(""), 10000)
          );
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player, isPlaying, captions, captionTimeout]);

  const parseTimestamp = (timestamp) => {
    const [hours, minutes, seconds] = timestamp.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <div className="App">
      <h1>Video Caption Provider</h1>

      <div className="url-input">
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button onClick={handleURLSubmit}>Load Video</button>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}

      {videoURL && (
        <div className="video-container">
          <div id="video-player"></div>
          <div className="caption-container">{currentCaption}</div>
        </div>
      )}

      <div className="play-pause-container">
        <button onClick={togglePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="caption-input">
        <h2>Add Captions</h2>
        <CaptionForm addCaption={addCaption} />
      </div>

      <div className="captions-display">
        <h2>Added Captions</h2>
        <div className="caption-list">
          {captions.map((caption, index) => (
            <div className="caption-item" key={index}>
              <span className="caption-timestamp">{caption.timestamp}</span>
              <span className="caption-text">{caption.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CaptionForm = ({ addCaption }) => {
  const [timestamp, setTimestamp] = useState("");
  const [text, setText] = useState("");

  const handleAddCaption = () => {
    if (timestamp && text) {
      addCaption(timestamp, text);
      setTimestamp("");
      setText("");
    }
  };

  return (
    <div className="caption-form">
      <input
        type="text"
        placeholder="Timestamp (e.g., 00:01:23)"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
      />
      <input
        type="text"
        placeholder="Caption text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAddCaption}>Add Caption</button>
    </div>
  );
};

export default App;
