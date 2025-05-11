import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';

function Success({setSucMessage , setContent}){
  const {id} = useParams();
  return (
    <>
     <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-xl mb-4">Content deleted successfully.</p>
        <div className="flex justify-end">
          <button
            onClick={ async ()=>{ setContent(  (await axios.get(`http://localhost:8080/content/${id}}` , {withCredentials:true})).data ) ;setSucMessage(false)}}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            OK
          </button>

        </div>
      </div>
    </div>
    </>
  )
}
function Delete({ setDelMessage, setSucMessage , courseId , contentId}) {
  console.log( `courseid: `+courseId + ` contentid: ` + contentId)
  const handleConfirm = async () =>{
   try { await axios.delete(`http://localhost:8080/content/remove/${courseId}/${contentId}` , {withCredentials:true})}
   catch (err) {console.log(err)}
    setDelMessage(false)
    setSucMessage(true)
  }
  const handleCancel = () =>{
    setDelMessage(false)
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-xl mb-4">Are you sure you want to delete?</p>
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseDetail( ) {
  const {user} = useAuth();
  const role = user?.role;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [delMessage , setDelMessage] = useState(false);
  const [sucMessage , setSucMessage] = useState(false);

useEffect(() => {
  const fetchCourseData = async () => {
    setIsLoading(true);

    // Initialize the variables
    let courseRes = null;
    let contentRes = null;

    try {
      if (role === 'instructor') {
        // Fetch course and content data for instructor
        courseRes = await axios.get(`http://localhost:8080/courses/course/${id}`, { withCredentials: true });
        contentRes = await axios.get(`http://localhost:8080/content/${id}`, { withCredentials: true });

      } else if (role === 'student') {
        // Fetch course and content data for student
        courseRes = await axios.get(`http://localhost:8080/courses/enrolled/${id}`, { withCredentials: true });
        contentRes = await axios.get(`http://localhost:8080/content/${id}`, { withCredentials: true });

        // Fetch the progress only for students
        try {
          const enrolledRes = await axios.get(`http://localhost:8080/courses/enrolledCourses`, {
            withCredentials: true
          });

          const enrollment = enrolledRes.data.find(c => c.id === parseInt(id));
          if (enrollment && enrollment.progress) {
            setProgress(enrollment.progress);
          }
        } catch (err) {
          console.error('Error fetching enrollment:', err);
        }
      }

      // Only set state if the responses are not null
      if (courseRes && contentRes) {
        setCourse(courseRes.data);
        setContent(contentRes.data);
      }

    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Failed to load course. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchCourseData();
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
    // Calculate new progress based on completed content
    const totalItems = content.length;
    const newProgress = Math.min(((progress * totalItems) + 1) / totalItems * 100, 100);
    updateProgress(newProgress);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (isLoading) {
    return <div className="text-center mt-8">Loading course...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!course) {
    return <div className="text-center mt-8">Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/courses" className="text-blue-500 hover:underline">
          &larr; Back to Courses
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-800 mb-4">Instructor: {course.instructor_name}</p>
            {course.duration_weeks && (
              <p className="text-gray-800 mb-4">Duration: {course.duration_weeks} weeks</p>
            )}
            { role === 'instructor'  && ( <p className="text-gray-800 mb-4" >Price: {course.price}$</p>)}

            { role === 'instructor'  && ( <p className="text-gray-800 mb-4" >Creation Date: {new Date(course.created_at).toLocaleDateString('en-CA')} </p>)}
            <p className="text-gray-800 mb-6">{course.description}</p>

          </div>

          {role === 'instructor' && (
            <Link
              to={`/courses/${id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit Course
            </Link>
          )}
        </div>

        {role === 'student' && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right mt-1">{Math.round(progress)}%</p>
          </div>
        )}
      </div>

      {role === 'instructor' && (
        <div className="mb-8">
          <Link
            to={`/courses/${id}/content/create`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Course Content
          </Link>
          <Link to={`/course/${id}/quiz`}  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Quiz Management</Link>
        </div>
      )}
{role === 'student' && (
  <div className="mb-8">
    <Link
      to={`/course/${id}/quizzes`}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
    >
      View Quizzes
    </Link>
  </div>
)}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Course Content</h2>

        {content.length === 0 ? (
          <p>No content available for this course yet.</p>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <div
                key={item.content_id}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      {item.content_type === 'video' && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                          Video
                        </span>
                      )}
                      {item.content_type === 'file' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                          File
                        </span>
                      )}
                      {item.content_type === 'audio' && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                          Audio
                        </span>
                      )}
                      {item.content_type === 'pdf' && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                          PDF
                        </span>
                      )}
                      {item.content_type === 'image' && (
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2">
                          Image
                        </span>
                      )}
                      <h3 className="text-xl font-medium">{item.file_name}</h3>
                    </div>
                    {item.uploaded_at && (
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded on {formatDate(item.uploaded_at)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Link
                      to={`/courses/${id}/content/${item.content_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>

                    {role === 'instructor' && (
                      <button
                        onClick={() =>{ setDelMessage(true)}}
                        className="ml-4 text-yellow-500 hover:underline"
                      >
                        Delete
                      </button>

                    )}
                  </div>
                  <div>
                    {delMessage && ( <Delete  setDelMessage={setDelMessage} setSucMessage={setSucMessage} courseId={id} contentId={item.content_id} />)}
                  </div>
                  <div>
                    {sucMessage && (<Success setSucMessage={setSucMessage} setContent={setContent}/>)}
                  </div>
                </div>

                {role === 'student' && (
                  <button
                    onClick={() => handleContentComplete()}
                    className="mt-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
