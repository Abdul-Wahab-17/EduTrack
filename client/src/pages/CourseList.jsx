import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CourseList() {
  const { user } = useAuth();
  const role = user?.role;

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
          const response = await axios.get('http://localhost:8080/courses', { withCredentials: true });
          setCourses(response.data);
        } else if (role === 'student') {
          const [enrolledRes, unenrolledRes] = await Promise.all([
            axios.get('http://localhost:8080/courses/enrolledCourses', { withCredentials: true }),
            axios.get('http://localhost:8080/courses/unenrolledCourses', { withCredentials: true })
          ]);
          setEnrolledCourses(enrolledRes.data);
          setUnenrolledCourses(unenrolledRes.data);
        } else {
          const response = await axios.get('http://localhost:8080/courses/allCourses', { withCredentials: true });
          setCourses(response.data);
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

  if (!user) return <div className="text-center text-lg mt-10">Loading user...</div>;
  if (isLoading) return <div className="text-center text-lg mt-10">Loading courses...</div>;
  if (error) return <div className="text-center text-red-500 text-lg mt-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Courses</h1>

      {role === 'instructor' && (
        <div className="mb-8">
          <Link
            to="/courses/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow"
          >
            + Create New Course
          </Link>
        </div>
      )}

      {role === 'student' && (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Enrolled Courses</h2>
            {enrolledCourses.length === 0 ? (
              <p className="text-gray-600">You are not enrolled in any courses.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                    <Link
                      to={`/courses/${course.id}`}
                      className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Continue Learning
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Courses</h2>
            {unenrolledCourses.length === 0 ? (
              <p className="text-gray-600">No more courses available for enrollment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {unenrolledCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Enroll
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {(role === 'instructor' || role === 'staff') && (
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    View Course
                  </Link>
                  {role === 'instructor' && (
                    <Link
                      to={`/courses/${course.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CourseList;
