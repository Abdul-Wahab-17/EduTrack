import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ViewContent() {
  const { courseId, contentId } = useParams();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContentData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/content/view/${contentId}`, { withCredentials: true });
        setContent(res.data);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentData();
  }, [contentId]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${content.content_type};base64,${content.file_data}`;
    link.download = content.file_name;
    link.click();
  };

  if (isLoading) {
    return <div className="text-center mt-8 text-gray-600">Loading content...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!content) {
    return <div className="text-center mt-8 text-gray-600">Content not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
  <div className="mb-8">
    <Link to={`/courses/${courseId}`} className="text-blue-500 hover:underline">
      &larr; Back to Course
    </Link>
  </div>

  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
    <h1 className="text-3xl font-bold mb-2">{content.file_name}</h1>
    <p className="text-gray-600 mb-4">
      Uploaded on: {new Date(content.uploaded_at).toLocaleDateString()}
    </p>

    <div className="mt-6">
      <button
        onClick={handleDownload}
        className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 text-white px-4 py-2 rounded transition"
      >
        Download Content
      </button>
    </div>
  </div>
</div>

  );
}

export default ViewContent;
