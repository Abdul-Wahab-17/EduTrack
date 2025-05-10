import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UploadFile = () => {
  const { courseId } = useParams();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [contentType, setContentType] = useState('file');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', fileName);
    formData.append('content_type', contentType);

    try {
      const response = await axios.post(`http://localhost:8080/content/upload/${courseId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white text-gray-800 shadow-lg rounded-lg max-w-xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Upload Content for Course {courseId}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file" className="block text-lg font-medium mb-2 text-gray-700">Select File</label>
          <input
            type="file"
            id="file"
            className="block w-full text-gray-900 bg-gray-100 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleFileChange}
            required
          />
        </div>

        <div>
          <label htmlFor="contentType" className="block text-lg font-medium mb-2 text-gray-700">Content Type</label>
          <select
            id="contentType"
            className="block w-full text-gray-900 bg-gray-100 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={contentType}
            onChange={handleContentTypeChange}
          >
            <option value="file">File</option>
            <option value="pdf">PDF Document</option>
            <option value="image">Image (JPEG, PNG, GIF)</option>
            <option value="video">Video (MP4, AVI)</option>
            <option value="audio">Audio (MP3, WAV)</option>
            <option value="presentation">Presentation (PPT, PPTX)</option>
            <option value="spreadsheet">Spreadsheet (XLS, XLSX)</option>
            <option value="document">Document (DOC, DOCX)</option>
            <option value="ebook">eBook (EPUB, MOBI)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-5 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Upload File
        </button>
      </form>

      {message && (
        <div className="mt-6 text-center text-lg text-gray-700">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
