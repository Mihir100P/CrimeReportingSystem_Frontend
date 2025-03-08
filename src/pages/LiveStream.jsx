import React, { useEffect, useRef } from 'react';

const LiveStream = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    }
  }, []);

  return (
    <div className="live-stream-container">
      <h2 className="text-xl font-bold mb-4">Live Crime Streaming</h2>
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg shadow-md" />
    </div>
  );
};

export default LiveStream;