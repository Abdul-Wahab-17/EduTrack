import axios from 'axios';
import { useEffect, useState } from 'react';

function Instructor() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/courses/courses`, { withCredentials: true })
      .then((res) => {
        setCourses(res.data);
      });
  }, []);

  return (
    <>
      <h1>Instructor Dashboard</h1><br />
      <h3>Your Courses:</h3>
      {courses.map(course => (
  <div key={course.id}>
    <br />
    <p>Title: {course.title}</p>
    <br />
  </div>
))}

    </>
  );
}

export default Instructor;
