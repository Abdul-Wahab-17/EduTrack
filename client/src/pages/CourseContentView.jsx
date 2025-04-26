import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ContentView({ role }) {
  const { id, contentId } = useParams(); // course id and content id
  const navigate = useNavigate();
  
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For quiz or assignment submissions
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Fetch the specific content post
        const response = await axios.get(
          `http://localhost:8080/courses/course/${id}/content/${contentId}`,
          { withCredentials: true }
        );
        
        setContent(response.data);
        
        // If student, check if already submitted
        if (role === 'student' && 
            (response.data.content_type === 'quiz' || response.data.content_type === 'assignment')) {
          try {
            const submissionEndpoint = response.data.content_type === 'quiz' 
              ? `quiz/${response.data.content_id}/submission`
              : `assignment/${response.data.content_id}/submission`;
              
            const submissionRes = await axios.get(
              `http://localhost:8080/courses/${submissionEndpoint}`,
              { withCredentials: true }
            );
            
            if (submissionRes.data) {
              setSubmitted(true);
              setSubmission(submissionRes.data.content || '');
            }
          } catch (err) {
            // No submission found is fine
            console.log('No submission found');
          }
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id, contentId, role]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submissionEndpoint = content.content_type === 'quiz' 
        ? `http://localhost:8080/courses/quiz/${content.content_id}/submit`
        : `http://localhost:8080/courses/assignment/${content.content_id}/submit`;
        
      await axios.post(
        submissionEndpoint,
        { submission_content: submission },
        { withCredentials: true }
      );
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return <div className="text-center mt-8">Loading content...</div>;
  }
  
  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }
  
  if (!content) {
    return <div className="text-center mt-8">Content not found</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to={`/courses/${id}`} className="text-blue-500 hover:underline">
          &larr; Back to Course
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              {content.content_type === 'lecture' && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Lecture
                </span>
              )}
              {content.content_type === 'assignment' && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Assignment
                </span>
              )}
              {content.content_type === 'quiz' && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Quiz
                </span>
              )}
              {content.content_type === 'announcement' && (
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Announcement
                </span>
              )}
              {content.content_type === 'slide' && (
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                  Slides
                </span>
              )}
              <h1 className="text-2xl font-bold">{content.postcol}</h1>
            </div>
            {content.timeOfPost && (
              <p className="text-gray-600">
                Posted on {formatDate(content.timeOfPost)}
              </p>
            )}
          </div>
          
          {role === 'instructor' && (
            <Link 
              to={`/courses/${id}/content/${contentId}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit Content
            </Link>
          )}
        </div>
        
        <div className="prose max-w-none">
          {/* Display content text here */}
          <div className="whitespace-pre-wrap">{content.content}</div>
        </div>
        
        {(content.content_type === 'quiz' || content.content_type === 'assignment') && role === 'student' && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">
              {content.content_type === 'quiz' ? 'Submit Quiz' : 'Submit Assignment'}
            </h3>
            
            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-bold">Submitted Successfully</p>
                {submission && (
                  <div className="mt-4">
                    <h4 className="font-medium">Your Submission:</h4>
                    <div className="mt-2 whitespace-pre-wrap">{submission}</div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="submission">
                    Your Answer
                  </label>
                  <textarea
                    id="submission"
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="8"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentView;