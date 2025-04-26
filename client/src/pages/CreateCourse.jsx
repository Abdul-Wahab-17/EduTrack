import React, { useState } from 'react';
import axios from 'axios';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [message, setMessage] = useState('');

  // Replace with real instructor ID from session/context
  const instructorId = 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/courses/createcourse', {
        instructorId,
        title,
        description,
        status
      });
      setMessage('Course created successfully!');
      setTitle('');
      setDescription('');
      setStatus('draft');
    } catch (err) {
      console.error('Failed to create course:', err);
      setMessage('Error creating course');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create New Course</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title: </label><br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Description: </label><br />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Status: </label><br />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;
