import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function CourseList({ role }) {
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
          // For instructors, fetch their created courses
          const response = await axios.get('http://localhost:8080/courses/courses', { 
            withCredentials: true 
          });
          setCourses(response.data);
        } else if (role === 'student') {
          // For students, fetch enrolled and available courses
          const [enrolledRes, unenrolledRes] = await Promise.all([
            axios.get('http://localhost:8080/courses/enrolledCourses', { withCredentials: true }),
            axios.get('http://localhost:8080/courses/unenrolledCourses', { withCredentials: true })
          ]);
          
          setEnrolledCourses(enrolledRes.data);
          setUnenrolledCourses(unenrolledRes.data);
        } else {
          // For staff or other users, fetch all courses
          const response = await axios.get('http://localhost:8080/courses/allCourses', { 
            withCredentials: true 
          });
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
      await axios.post('http://localhost:8080/courses/enroll', 
        { course_id: courseId }, 
        { withCredentials: true }
      );
      
      // Refresh course lists after enrollment
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
    return <div className="text-center mt-8">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      
      {role === 'instructor' && (
        <div className="mb-6">
          <Link 
            to="/courses/create" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create New Course
          </Link>
        </div>
      )}
      
      {role === 'student' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <p className="mb-6">You are not enrolled in any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {enrolledCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="border rounded-lg shadow-md overflow-hidden bg-white"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <Link 
                      to={`/courses/${course.id}`}
                      className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
          {unenrolledCourses.length === 0 ? (
            <p>No more courses available for enrollment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unenrolledCourses.map((course, index) => (
                <div 
                  key={index}
                  className="border rounded-lg shadow-md overflow-hidden bg-white"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {(role === 'instructor' || role === 'staff') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="border rounded-lg shadow-md overflow-hidden bg-white"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <Link 
                  to={`/courses/${course.id}`}
                  className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  View Course
                </Link>
                {role === 'instructor' && (
                  <Link 
                    to={`/courses/${course.id}/edit`}
                    className="mt-4 ml-2 inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;