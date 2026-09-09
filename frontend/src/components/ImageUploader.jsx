import { useRef } from "react";

function ImageUploader({ onImageSelect, className = "" }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please provide an image file.");
      return;
    }

    onImageSelect(file);
  };

  return (
    <div className={`upload-trigger ${className}`.trim()}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="upload-button"
      >
        <span className="upload-icon">📁</span>
        <span className="upload-text">Upload image</span>
      </button>
    </div>
  );
}

export default ImageUploader;
