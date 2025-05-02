// src/pages/StudentDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function StudentDashboard() {

const {user} = useAuth();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    country: "",
    profile_picture_url: "",
  });


  useEffect(() => {
    const fetchData = () => {

        
        setStudent(user);
      axios
        .get('http://localhost:8080/courses/enrolledCourses', { withCredentials: true })
        .then((enrollmentsResponse) => {
           
            setEnrolledCourses(enrollmentsResponse.data);
          
          
          setFormData({
            full_name: user.full_name,
            bio: user.bio,
            email: user.email,
            profile_picture_url: user.profile_picture_url,
          });
          
         
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
            
          setIsLoading(false);
        });
    };
  
    fetchData();
  }, [user]);
  
  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      setStudent(updatedUser);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        {/* Student Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={student.profilePic}
              alt={student.full_name}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {student.username}
              </h1>
              <p className="text-gray-600">{student.country}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(student.joinDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Email: {student.email}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleEditProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-gray-700">Bio</h3>
            <p className="text-gray-600">{student.bio}</p>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    name="profile_picture_url"
                    value={formData.profile_picture_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Courses Enrolled
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {enrolledCourses.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-yellow-500">
              {
                enrolledCourses.filter(
                  (course) => course.status === "in_progress"
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Completed
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {
                enrolledCourses.filter(
                  (course) => course.status === "completed"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Enrolled Courses */}
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

       
      </div>
    </div>
  );
}