// src/components/FileUpload.tsx

"use client";

import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onFileUpload: (fileInfo: { filePath: string; fileName: string }) => void;
}

const FileUpload: React.FC<Props> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onFileUpload({
        filePath: response.data.path,
        fileName: file.name,
      });
      setFile(null); // Clear the file input after upload
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file}>
        Upload File
      </button>
    </div>
  );
};

export default FileUpload; // Ensure this is a default export
