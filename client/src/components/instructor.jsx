// pages/InstructorDashboard.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PencilIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import CreateCourseForm from '../components/CreateCourseForm';

const InstructorDashboard = () => {
  const { user } = useAuth(); // Assuming `AuthContext` provides user data
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editProfile, setEditProfile] = useState(false);

  const navigate = useNavigate();

 const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses function
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/courses/ownedCourses', { withCredentials: true });
      console.log('API Response Data:', response.data); // Log API response for debugging
      setCourses(response.data); // Store fetched courses in the state
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  // Call fetchCourses when the component mounts
  useEffect(() => {
    fetchCourses(); // Fetch courses on component mount
  }, []); // Empty dependency array ensures this only runs once

  if (loading) return <div>Loading...</div>; // Show loading while fetching
  if (error) return <div>{error}</div>;
  // const stats = [
  //   {
  //     name: 'Total Students',
  //     value: courses.reduce((sum, course) => sum + course.students, 0).toLocaleString(),
  //     icon: UserGroupIcon,
  //     change: '+12%',
  //     changeType: 'positive'
  //   },
  //   {
  //     name: 'Total Revenue',
  //     value: `$${courses.reduce((sum, course) => {
  //       const revenue = parseFloat(course.revenue.replace(/[^0-9.]/g, ''));
  //       return sum + revenue;
  //     }, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  //     icon: CurrencyDollarIcon,
  //     change: '+24%',
  //     changeType: 'positive'
  //   },
  //   {
  //     name: 'Course Rating',
  //     value: courses.length > 0
  //       ? `${(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}/5`
  //       : '0/5',
  //     icon: ChartBarIcon,
  //     change: '+0.2',
  //     changeType: 'positive'
  //   },
  //   {
  //     name: 'Courses Published',
  //     value: courses.length,
  //     icon: BookOpenIcon,
  //     change: `+${Math.max(0, courses.length - 3)}`,
  //     changeType: 'positive'
  //   },
  // ];

  const feedbacks = [
    {
      id: 1,
      course: "Machine Learning A-Z",
      student: "Alex Johnson",
      rating: 5,
      comment: "Excellent course! The instructor explains complex concepts in a very understandable way.",
      date: "2 days ago"
    },
    {
      id: 2,
      course: "The Complete Web Developer",
      student: "Sarah Williams",
      rating: 4,
      comment: "Great content, but some sections could use more practical examples.",
      date: "1 week ago"
    },
    {
      id: 3,
      course: "Digital Marketing Masterclass",
      student: "Michael Brown",
      rating: 5,
      comment: "Changed my perspective on digital marketing. Highly recommended!",
      date: "3 weeks ago"
    }
  ];

  const analyticsData = {
    enrollments: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [1200, 1900, 3000, 2500, 2100, 3200]
    },
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [5400, 8200, 12500, 9800, 11500, 15800]
    },
    topCourses: [
      { name: "Machine Learning A-Z", students: 12450 },
      { name: "The Complete Web Developer", students: 8765 },
      { name: "Digital Marketing Masterclass", students: 5421 }
    ]
  };

  const handleNewCourse = () => {
    setCourseToEdit(null);
    setShowCreateForm(true);
  };

  // const handleEditCourse = (course) => {
  //   setCourseToEdit(course);
  //   setShowCreateForm(true);
  // };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    // You can reload courses here if needed
  };

  const handleProfileChange = () => {
   //  const { name, value } = e.target;
    // Update profile using setState or context update
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // You can update the profile image in context here
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // Save updated profile data to context
    setEditProfile(false);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };


  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                  src={user.profilePic}
                  alt="Instructor profile"
                />
                <button
                  onClick={() => setEditProfile(true)}
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                >
                  <PencilIcon className="h-4 w-4 text-indigo-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {user.username}!</h1>
                <p className="mt-2 text-purple-100 max-w-lg">
                  {user.bio}
                </p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleNewCourse}
                    className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-200"
                  >
                    Create New Course
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="text-white border border-white hover:bg-purple-700 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-200"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${activeTab === 'analytics' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`${activeTab === 'feedback' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Student Feedback
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats */}
            {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <ArrowTrendingUpIcon className={`-ml-1 mr-0.5 h-4 w-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="sr-only">{stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Your Courses */}
         <div className="mb-12">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Courses</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.map((course) => (
      <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 w-full overflow-hidden">
          <img
            src={course.image_url || 'https://via.placeholder.com/300x200'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-2">{course.description || 'No description available'}</p>
          <p className="text-gray-600 mb-2">Price: ${course.price || 'N/A'}</p>
          <p className="text-gray-600 mb-2">Duration: {course.duration_weeks || 'N/A'} weeks</p>
          <p className="text-gray-600 mb-4">Status: {course.status}</p>

          <div className="flex justify-between">
            <button
              onClick={() => navigate(`/courses/${course.id}`)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View
            </button>
            <button
              onClick={() => handleDeleteCourse(course.id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create New Course */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">Create New Course</h3>
                        <p className="mt-1 text-sm text-gray-500">Start building your next course</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleNewCourse}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Analytics */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <ChartBarIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">View Analytics</h3>
                        <p className="mt-1 text-sm text-gray-500">See detailed course performance</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </div>
                </div>

                {/* Student Feedback */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <UserGroupIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">Student Feedback</h3>
                        <p className="mt-1 text-sm text-gray-500">Read recent student reviews</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('feedback')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-200"
                      >
                        View Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Enrollment Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Enrollments</h3>
                <div className="h-64">
                  {/* This would be a chart in a real app - using a simple bar representation */}
                  <div className="flex items-end h-48 space-x-2">
                    {analyticsData.enrollments.data.map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="bg-indigo-500 w-full rounded-t-sm"
                          style={{ height: `${(value / Math.max(...analyticsData.enrollments.data)) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{analyticsData.enrollments.labels[index]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Total: {analyticsData.enrollments.data.reduce((a, b) => a + b, 0).toLocaleString()} enrollments
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Revenue</h3>
                <div className="h-64">
                  {/* This would be a chart in a real app - using a simple bar representation */}
                  <div className="flex items-end h-48 space-x-2">
                    {analyticsData.revenue.data.map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="bg-green-500 w-full rounded-t-sm"
                          style={{ height: `${(value / Math.max(...analyticsData.revenue.data)) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{analyticsData.revenue.labels[index]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Total: ${analyticsData.revenue.data.reduce((a, b) => a + b, 0).toLocaleString()} revenue
                  </div>
                </div>
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Top Performing Courses</h3>
              <div className="space-y-4">
                {analyticsData.topCourses.map((course, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2/5 font-medium text-gray-700">{course.name}</div>
                    <div className="w-3/5">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${(course.students / analyticsData.topCourses[0].students) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/5 text-right text-sm text-gray-500">
                      {course.students.toLocaleString()} students
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Feedback</h2>

            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {feedback.student.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-800">{feedback.student}</h4>
                        <span className="text-xs text-gray-500">{feedback.date}</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        {renderStars(feedback.rating)}
                        <span className="ml-2 text-xs text-gray-500">{feedback.rating}.0 rating</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{feedback.comment}</p>
                      <div className="mt-3 flex space-x-4">
                        <button className="text-xs text-indigo-600 hover:text-indigo-800">
                          Reply
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Course Modal */}
        {showCreateForm && (
          <CreateCourseForm
            onClose={handleCloseForm}
            courseToEdit={courseToEdit}
          />
        )}

        {/* Edit Profile Modal */}
        {editProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                  <button
                    onClick={() => setEditProfile(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                        src={user.profilePic}
                        alt="Profile preview"
                      />
                      <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 cursor-pointer">
                        <PencilIcon className="h-4 w-4 text-indigo-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={user.username}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={user.bio}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditProfile(false)}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;