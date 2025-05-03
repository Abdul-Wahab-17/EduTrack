import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
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

  if (!user) navigate(`/about`);
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
          <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Courses</h2>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                You haven't enrolled in any courses yet.
              </p>
              <a
                href="/courses"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Browse available courses
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Instructor: {course.instructor_name}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
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

                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          course.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </section>

          <section>
          <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Courses</h2>
          {unenrolledCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                You haven't enrolled in any courses yet.
              </p>
              <a
                href="/courses"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Browse available courses
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unenrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Instructor: {course.instructor_name}
                    </p>

                   

                    <div className="flex items-center justify-between mt-4">
                     
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                        onClick={handleEnroll}
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
