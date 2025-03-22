import React, { useRef } from 'react';

function FileUploader({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Sprawdzanie rozszerzenia pliku
    if (!file.name.endsWith('.json')) {
      alert('Proszę wybrać plik JSON');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      onFileUpload(content);
    };
    reader.onerror = () => {
      alert('Wystąpił błąd podczas wczytywania pliku');
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-uploader">
      <h2>Importuj zadania z pliku JSON</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ marginBottom: '20px' }}
      />
    </div>
  );
}

export default FileUploader;