import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ResultCard from "../components/ResultCard";
import CameraCapture from "../components/CameraCapture";

function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImage = async (file) => {
    setImage(file);
    setResult(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/api/items/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyse the image");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({
        status: "UNKNOWN",
        item: "UNKNOWN",
        reason: "Something went wrong while analyzing the image",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-page">
      {showCamera && (
        <CameraCapture
          onImageCapture={(file) => {
            setShowCamera(false);
            handleImage(file);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      <section className="hero-card">
        <div className="copy-panel">
          <span className="eyebrow">Item screening</span>
          <h1>Check whether an item is allowed before you travel.</h1>
          <p>
            Upload a clear photo or take a quick snapshot to get an instant
            review of the item status.
          </p>

          <div className="action-row">
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="primary-btn"
            >
              Take a photo
            </button>

            <ImageUploader
              onImageSelect={handleImage}
              className="secondary-upload-btn"
            />
          </div>

          <ul className="feature-list">
            <li>Fast image review</li>
            <li>Clear result status</li>
            <li>Simple travel guidance</li>
          </ul>
        </div>

        <div className="preview-panel">
          <div className="panel-header">
            <h2>Scan preview</h2>
            {result && <span className="mini-pill">Ready</span>}
          </div>

          {image ? (
            <div className="image-preview-frame">
              <img
                src={URL.createObjectURL(image)}
                alt="Selected Item"
                className="image-preview"
              />
            </div>
          ) : (
            <div className="empty-preview">
              <div className="empty-icon">📷</div>
              <p>No image uploaded yet</p>
              <span>Take a photo or upload one to get started.</span>
            </div>
          )}

          {isProcessing && (
            <div className="status-banner processing">Analyzing image…</div>
          )}

          {result && <ResultCard result={result} />}
        </div>
      </section>
    </div>
  );
}

export default Home;
