import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  // Login form state
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get login function from AuthContext

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePic:'',
    bio:''
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      // Call the login function from AuthContext
      await login({ username, password });

      // If successful, navigate to dashboard
      if (isAuthenticated) {
        navigate('/dashboard'); // Redirect based on user role
      }
    } catch (error) {
      setLoginError(error.message || 'Invalid username or password');
    }
  };

  const validateRegisterForm = () => {
    const errors = {};

    if (!registerForm.name) errors.name = 'Name is required';

    if (!registerForm.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = 'Email is invalid';
    }

    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!registerForm.role) {
      errors.role = 'Please select a role';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };


const handleRegisterSubmit = async (e) => {
  e.preventDefault();

  if (validateRegisterForm()) {
    try {
      const payload = {
        username: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
        bio: registerForm.bio,
        profilePic: registerForm.profilePic
      };

      await axios.post(
        'http://localhost:8080/auth/register', // adjust URL if needed
        payload,
        { withCredentials: true } // important for session cookie
      );

      const user = { username:payload.username , password:payload.password}

      // Set user state, close modal, reset form, navigate
      login(user);  // your login function that sets user context
      setShowRegisterModal(false);
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      navigate('/dashboard');

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-50">

    {!showRegisterModal && (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <LockClosedIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 hover:shadow-md"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition duration-200" />
                </span>
                Sign in
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setShowRegisterModal(true)}
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

                  )}


      {showRegisterModal && (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200`}
                      placeholder="John Doe"
                    />
                  </div>
                  {registerErrors.name && <p className="mt-1 text-sm text-red-600">{registerErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {registerErrors.email && <p className="mt-1 text-sm text-red-600">{registerErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="profilePic"
                      name="profilePic"
                      type="text"
                      value={registerForm.profilePic}
                      onChange={handleRegisterChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200"
                      placeholder="https://example.com/image"
                    />
                  </div>
                </div>

                 <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="bio"
                      name="bio"
                      type="text"
                      value={registerForm.bio}
                      onChange={handleRegisterChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200"
                      placeholder="bio"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {registerErrors.password && <p className="mt-1 text-sm text-red-600">{registerErrors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${registerErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none transition duration-200`}
                      placeholder="••••••••"
                    />
                  </div>
                  {registerErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{registerErrors.confirmPassword}</p>}
                </div>
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
  <div className="flex items-center space-x-6">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="role"
        value="student"
        onChange={handleRegisterChange}
        checked={registerForm.role === "student"}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <span className="ml-2 text-sm text-gray-700">Student</span>
    </label>

    <label className="inline-flex items-center">
      <input
        type="radio"
        name="role"
        value="instructor"
        onChange={handleRegisterChange}
        checked={registerForm.role === "instructor"}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <span className="ml-2 text-sm text-gray-700">Instructor</span>
    </label>
  </div>
  {registerErrors.role && (
    <p className="mt-1 text-sm text-red-600">{registerErrors.role}</p>
  )}
</div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}




    </div>
  );
}
