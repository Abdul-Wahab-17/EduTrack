import axios from 'axios';
import { useEffect, useState } from 'react';

function Instructor() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/data/courses`, { withCredentials: true })
      .then((res) => {
        setCourses(res.data);
      });
  }, []);

  return (
    <>
      <h1>Instructor Dashboard</h1>
      <h3>Your Courses:</h3>
      {courses.map(course => (
  <div key={course.id}>
    <p>Title: {course.title}</p>
    <br />
  </div>
))}

    </>
  );
}

export default Instructor;
