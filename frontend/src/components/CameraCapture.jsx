import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture({ onImageCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log("Requesting camera access...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        console.log("Camera access granted!");
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setCameraReady(true);
          setError("");
        }
      } catch (error) {
        console.error("Camera error:", error);
        handleCameraError(error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCameraError = (error) => {
    let errorMsg = "Unable to access camera.";

    if (
      error.name === "PermissionDeniedError" ||
      error.name === "NotAllowedError"
    ) {
      errorMsg =
        "❌ Camera permission was denied. Please allow camera access in your browser settings and refresh the page.";
    } else if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      errorMsg =
        "❌ No camera device found. Please connect a camera and refresh.";
    } else if (error.name === "NotSupportedError") {
      errorMsg =
        "❌ Your browser doesn't support camera access. Try Chrome or Firefox.";
    } else if (error.name === "TypeError") {
      errorMsg = "❌ HTTPS or localhost required for camera access.";
    } else {
      errorMsg = `❌ Camera error: ${error.message || error.name}`;
    }

    setError(errorMsg);
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageSrc = canvas.toDataURL("image/jpeg");
        setImgSrc(imageSrc);
      } catch (err) {
        console.error("Capture error:", err);
        alert("Error capturing image: " + err.message);
      }
    }
  };

  const handleCapture = async () => {
    try {
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      const file = new File([blob], "camera-photo.jpg", {
        type: "image/jpeg",
      });
      onImageCapture(file);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onClose();
    } catch (error) {
      console.error("Error converting image:", error);
      alert("Error processing image");
    }
  };

  const retake = () => {
    setImgSrc(null);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4">
        <h2 className="mb-4 text-xl font-bold">📸 Camera Preview</h2>

        {error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <p className="text-red-600 mb-4 font-semibold">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setError("");
                  setCameraReady(false);
                  window.location.reload();
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Refresh & Retry
              </button>
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : !imgSrc ? (
          <>
            <div className="relative bg-black rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "auto",
                  minHeight: "300px",
                  display: cameraReady ? "block" : "none",
                }}
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center">
                    <div className="text-white text-lg mb-2">
                      ⏳ Loading camera...
                    </div>
                    <p className="text-gray-300 text-sm">
                      Please allow camera access when prompted
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={capture}
                disabled={!cameraReady}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📸 Click Picture
              </button>
              <button
                onClick={handleClose}
                className="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="mb-3 font-semibold">Captured Photo:</h3>
            <img
              src={imgSrc}
              alt="webcam snapshot"
              className="mb-4 w-full rounded-xl"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCapture}
                className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
              >
                ✓ Confirm & Analyze
              </button>
              <button
                onClick={retake}
                className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Retake Photo
              </button>
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
