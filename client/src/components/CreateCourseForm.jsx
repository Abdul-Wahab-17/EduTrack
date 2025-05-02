import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function CreateCourseForm({ onClose, courseToEdit }) {
  const [courseData, setCourseData] = useState({
    title: '',
    price: '',
    duration_weeks: '',
    description: '',
    image_url: '',
    imagePreview: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseToEdit) {
      setCourseData({
        title: courseToEdit.title,
        price: courseToEdit.price || '',
        duration_weeks: courseToEdit.duration_weeks || '',
        description: courseToEdit.description || '',
        image: null,
        imagePreview: courseToEdit.image_url || '',
      });
    }
  }, [courseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const payload = {
        instructorId: courseData.instructor,
        title: courseData.title,
        description: courseData.description,
        price: courseData.price || 0,
        duration_weeks: courseData.duration,
        status: 'draft', // or 'published'
        image_url: courseData.image_url,
      };
  
      const res = await axios.post('http://localhost:8080/courses/createcourse', payload, {
        withCredentials: true,
      });
  
      if (res.status === 201) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate('/dashboard');
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to create course:', err);
      alert(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {courseToEdit ? 'Edit Course' : 'Create New Course'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {showSuccessMessage && (
            <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center">
              Course created successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (weeks)</label>
                <input
                  type="number"
                  name="duration_weeks"
                  value={courseData.duration_weeks}
                  onChange={handleChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  rows="4"
                />
              </div>











              <div className="sm:col-span-2">
  <label className="block text-sm font-medium text-gray-700">Course Image URL</label>
  <div className="mt-1 flex items-center">
    {courseData.image_url ? (
      <img
        src={courseData.image_url}
        alt="Preview"
        className="h-16 w-16 rounded-md object-cover"
      />
    ) : (
      <span className="flex items-center justify-center h-16 w-16 rounded-md overflow-hidden bg-gray-100">
        <svg className="h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
    )}

    <input
      type="text"
      name="image_url"
      value={courseData.image_url}
      onChange={handleChange}
      placeholder="https://example.com/image.jpg"
      className="ml-5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
    />
  </div>
</div>








            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting 
                  ? courseToEdit ? 'Updating...' : 'Creating...' 
                  : courseToEdit ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
