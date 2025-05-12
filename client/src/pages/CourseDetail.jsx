import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  PhotoIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';

function ConfirmationModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{message}</h3>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">{message}</h3>
          <div className="mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingStars({ rating, setRating, disabled = false }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && setRating(star)}
          className={`${!disabled ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'} text-gray-400`}
          disabled={disabled}
        >
          <StarIcon
            className={`h-8 w-8 ${(rating || 0) >= star ? 'text-yellow-400 fill-yellow-400' : ''}`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingModal({ isOpen, onClose, onSubmit, currentRating }) {
  const [rating, setRating] = useState(currentRating || 0);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rate this course</h3>
        <div className="flex justify-center mb-6">
          <RatingStars rating={rating} setRating={setRating} />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 ${rating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseDetail() {
  const { user } = useAuth();
  const role = user?.role;
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [feedback , setFeedback] = useState('');

const [showFeedbackSection, setShowFeedbackSection] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let courseRes, contentRes;

        if (role === 'instructor') {
          [courseRes, contentRes] = await Promise.all([
            axios.get(`http://localhost:8080/courses/course/${id}`, { withCredentials: true }),
            axios.get(`http://localhost:8080/content/${id}`, { withCredentials: true })
          ]);
        } else if (role === 'student') {
          [courseRes, contentRes] = await Promise.all([
            axios.get(`http://localhost:8080/courses/enrolled/${id}`, { withCredentials: true }),
            axios.get(`http://localhost:8080/content/${id}`, { withCredentials: true })
          ]);

          try {
            const enrolledRes = await axios.get(`http://localhost:8080/courses/enrolledCourses`, {
              withCredentials: true
            });
            const enrollment = enrolledRes.data.find(c => c.id === parseInt(id));
            if (enrollment?.progress) {
              setProgress(enrollment.progress);
            }
          } catch (err) {
            console.error('Error fetching enrollment:', err);
          }

          // Fetch user's existing rating
          const ratingRes = await axios.get(
            `http://localhost:8080/courses/${id}/user-rating`,
            { withCredentials: true }
          );
          setUserRating(ratingRes.data.rating || 0);
        }

        setCourse(courseRes.data);
        setContent(contentRes.data);
        setAverageRating(courseRes.data.average_rating || 0);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id, role]);

  useEffect(() => {
  if (role === 'student') {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/courses/${id}/feedback`,
          { withCredentials: true }
        );
        if (response.data.feedback) {
          setFeedback(response.data.feedback);
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };
    fetchFeedback();
  }
}, [id, role]);

  const updateProgress = async (newProgress) => {
    try {
      await axios.put(
        `http://localhost:8080/courses/course/${id}/progress`,
        { progress: newProgress },
        { withCredentials: true }
      );
      setProgress(newProgress);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleContentComplete = () => {
    const totalItems = content.length;
    const newProgress = Math.min(((progress * totalItems) + 1) / totalItems * 100, 100);
    updateProgress(newProgress);
  };
const submitFeedback = async () => {
  try {
    await axios.put(`http://localhost:8080/courses/${id}/feedback`, { feedback } , {withCredentials:true});
    alert("Feedback submitted successfully!");
  } catch (error) {
    console.error("Failed to submit feedback:", error.message);
    alert("Failed to submit feedback.");
  }
};

  const handleDeleteContent = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/content/remove/${id}/${selectedContentId}`,
        { withCredentials: true }
      );
      setContent(content.filter(item => item.content_id !== selectedContentId));
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content. Please try again.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleRateCourse = async (rating) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/courses/${id}/rate`,
        { rating },
        { withCredentials: true }
      );

      setUserRating(rating);
      setAverageRating(response.data.newAverage);
    } catch (err) {
      console.error('Error rating course:', err);
      setError('Failed to submit rating. Please try again.');
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-5 w-5 text-blue-500" />;
      case 'file': return <DocumentTextIcon className="h-5 w-5 text-yellow-500" />;
      case 'audio': return <MusicalNoteIcon className="h-5 w-5 text-green-500" />;
      case 'pdf': return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      case 'image': return <PhotoIcon className="h-5 w-5 text-indigo-500" />;
      default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Link
            to="/courses"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <p className="text-lg">Course not found</p>
          <Link
            to="/courses"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  Instructor: <span className="font-medium">{course.instructor_name}</span>
                </p>

                <div className="flex flex-wrap gap-4 mb-4">
                  {course.duration_weeks && (
                    <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800">
                      {course.duration_weeks} weeks
                    </div>
                  )}
                  {role === 'instructor' && (
                    <div className="bg-green-50 px-3 py-1 rounded-full text-sm text-green-800">
                      ${course.price}
                    </div>
                  )}
                  {role === 'instructor' && (
                    <div className="bg-purple-50 px-3 py-1 rounded-full text-sm text-purple-800">
                      Created: {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <p className="text-gray-700">{course.description}</p>
              </div>

              {role === 'instructor' && (
                <div className="mt-4 sm:mt-0 flex space-x-2">
                  <button
                    onClick={() => navigate(`/courses/${id}/edit`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Course
                  </button>
                </div>
              )}
            </div>

            {/* Rating Section */}
          {role === 'student' && (
  <div className="mt-6 space-y-4">
    {/* Rating Section */}
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-900">Course Rating</h3>
      <span className="text-sm text-gray-500">
        {userRating ? `${userRating.toFixed(1)}/5` : 'Not rated yet'}
      </span>
    </div>

    <div className="flex items-center space-x-4">
      <RatingStars rating={userRating} disabled={true} />
      <button
        onClick={() => setShowRatingModal(true)}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        {userRating > 0 ? 'Update your rating' : 'Rate this course'}
      </button>
    </div>

    {/* Progress Section */}
    <div className="flex items-center justify-between mt-4">
      <h3 className="text-sm font-medium text-gray-900">Your Progress</h3>
      <span className="text-sm font-medium text-indigo-600">
        {Math.round(progress)}% Complete
      </span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-indigo-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>

    {/* Feedback Section (Collapsible) */}
    <div className="pt-4 border-t border-gray-200">
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-medium text-gray-900">Your Feedback</h3>
    <button
      onClick={() => setShowFeedbackSection(!showFeedbackSection)}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
    >
      {showFeedbackSection ? 'Hide' : feedback ? 'Edit feedback' : 'Add feedback'}
    </button>
  </div>

  {/* Show existing feedback when collapsed */}
  {!showFeedbackSection && feedback && (
    <div className="mt-3 p-3 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-700">{feedback}</p>
    </div>
  )}

  {/* Feedback form when expanded */}
  {showFeedbackSection && (
    <div className="mt-4 space-y-3">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
        placeholder="Share your thoughts about this course..."
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowFeedbackSection(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={submitFeedback}
          disabled={!feedback.trim()}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 ${
            !feedback.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {feedback ? 'Update Feedback' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  )}
</div>
  </div>
)}

          </div>
        </div>

        {/* Action Buttons */}
        {role === 'instructor' && (
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate(`/courses/${id}/content/create`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Content
            </button>
            <button
              onClick={() => navigate(`/course/${id}/quiz`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Quiz Management
            </button>
            <button
              onClick={() => navigate(`/course/${id}/assignments`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Assignment Management
            </button>
          </div>
        )}

        {role === 'student' && (
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate(`/course/${id}/quizzes`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              View Quizzes
            </button>
            <button
              onClick={() => navigate(`/course/${id}/assignment`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              View Assignments
            </button>
          </div>
        )}

        {/* Course Content */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
          </div>

          {content.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No content available for this course yet.</p>
              {role === 'instructor' && (
                <button
                  onClick={() => navigate(`/courses/${id}/content/create`)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Content
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {content.map((item) => (
                <li key={item.content_id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0 mr-4">
                        {getContentTypeIcon(item.content_type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-indigo-600 truncate">
                          {item.file_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(item.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/courses/${id}/content/${item.content_id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      {role === 'instructor' && (
                        <button
                          onClick={() => {
                            setSelectedContentId(item.content_id);
                            setShowDeleteModal(true);
                          }}
                          className="text-sm font-medium text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {role === 'student' && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleContentComplete}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteContent}
        onCancel={() => setShowDeleteModal(false)}
        message="Are you sure you want to delete this content?"
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Content deleted successfully!"
      />
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRateCourse}
        currentRating={userRating}
      />
    </div>
  );
}

export default CourseDetail;