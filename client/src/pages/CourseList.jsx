import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CourseList() {
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [unenrolledCourses, setUnenrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        if (role === 'instructor') {
          const response = await axios.get('http://localhost:8080/courses/ownedCourses', { withCredentials: true });
          setCourses(response.data);
        } else if (role === 'student') {
          const [enrolledRes, unenrolledRes] = await Promise.all([
            axios.get('http://localhost:8080/courses/enrolledCourses', { withCredentials: true }),
            axios.get('http://localhost:8080/courses/unenrolledCourses', { withCredentials: true })
          ]);
          setEnrolledCourses(enrolledRes.data);
          setUnenrolledCourses(unenrolledRes.data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [role]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('http://localhost:8080/courses/enroll', { course_id: courseId }, { withCredentials: true });
      const [enrolledRes, unenrolledRes] = await Promise.all([
        axios.get('http://localhost:8080/courses/enrolledCourses', { withCredentials: true }),
        axios.get('http://localhost:8080/courses/unenrolledCourses', { withCredentials: true })
      ]);
      setEnrolledCourses(enrolledRes.data);
      setUnenrolledCourses(unenrolledRes.data);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Learning Dashboard</h1>
        {role === 'instructor' && (
          <Link
            to="/courses/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow transition duration-200"
          >
            + Create New Course
          </Link>
        )}
      </div>

      {role === 'student' && (
        <>
          {/* Enrolled Courses Section */}
          <section className="mb-12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">My Courses</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {enrolledCourses.length} enrolled
                  </span>
                </div>

                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No courses yet</h3>
                    <p className="mt-1 text-gray-500">Get started by enrolling in a course below.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => window.scrollTo({ top: document.getElementById('available-courses').offsetTop, behavior: 'smooth' })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Browse Courses
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 relative">
                          <img
                            src={course.image_url || 'https://via.placeholder.com/400x225'}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x225';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h3 className="font-bold text-white text-lg">{course.title}</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">
                              Instructor: {course.instructor_name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              course.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {course.status === "completed" ? "Completed" : "In Progress"}
                            </span>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-full rounded-full ${
                                  course.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}
                            </span>
                            <button
                              onClick={() => navigate(`/courses/${course.id}`)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded transition duration-200"
                            >
                              {course.progress > 0 ? 'Continue' : 'Start'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Available Courses Section */}
          <section id="available-courses">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Available Courses</h2>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    {unenrolledCourses.length} available
                  </span>
                </div>

                {unenrolledCourses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No available courses</h3>
                    <p className="mt-1 text-gray-500">Check back later for new courses.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unenrolledCourses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 relative">
                          <img
                            src={course.image_url || 'https://via.placeholder.com/400x225'}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x225';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h3 className="font-bold text-white text-lg">{course.title}</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">
                              Instructor: {course.instructor_name || 'Not specified'}
                            </span>
                            {course.price && (
                              <span className="text-sm font-medium text-gray-900">
                                ${course.price}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {course.description || 'No description available'}
                          </p>

                          <button
                            onClick={() => handleEnroll(course.id)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition duration-200"
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {role === 'instructor' && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">My Courses</h2>
            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {courses.length} courses
            </span>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No courses created yet</h3>
              <p className="mt-1 text-gray-500">Get started by creating your first course.</p>
              <div className="mt-6">
                <Link
                  to="/courses/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Course
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={course.image_url || 'https://via.placeholder.com/400x225'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x225';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status || 'draft'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description || 'No description provided'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.duration_weeks || '0'} weeks</span>
                      {course.price && (
                        <span className="font-medium">${course.price}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded transition duration-200"
                      >
                        View
                      </Link>
                      <Link
                        to={`/courses/${course.id}/edit`}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 px-4 rounded transition duration-200"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default CourseList;