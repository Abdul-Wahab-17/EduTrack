import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UploadFile = () => {
  const { id } = useParams(); // Get the course ID from the URL params
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [contentType, setContentType] = useState('file'); // Default type 'file'
  const [message, setMessage] = useState('');

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  // Handle content type selection
  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    // Create FormData to send the file and associated data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', fileName);
    formData.append('content_type', contentType);
    formData.append('course_id', id); // Include course ID from URL

    try {
            const response = await axios.post(`http://localhost:8080/content/upload/${id}`, formData, {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data', // This tells the backend that it's a file upload
              },
            });

      setMessage('File uploaded successfully!');
      console.log(response.data); // Handle response data (e.g., success message, file info)
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white shadow-md rounded-lg max-w-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Upload Content for Course {id}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select File</label>
          <input
            type="file"
            id="file"
            className="mt-1 block w-full text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">Content Type</label>
          <select
            id="contentType"
            className="mt-1 block w-full text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={contentType}
            onChange={handleContentTypeChange}
          >
            <option value="file">File</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Upload File
        </button>
      </form>

      {message && (
        <div className="mt-6 text-center text-sm text-gray-700">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
