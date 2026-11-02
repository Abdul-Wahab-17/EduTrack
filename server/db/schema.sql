-- EduTrack schema. Loaded automatically by the MySQL container (see ../../docker-compose.yml);
-- for a local MySQL run:  mysql -u root -p < db/schema.sql
-- The `sessions` table is created by express-mysql-session on first start.
CREATE DATABASE IF NOT EXISTS edutrack CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE edutrack;

CREATE TABLE IF NOT EXISTS users (
  user_id             INT AUTO_INCREMENT PRIMARY KEY,
  username            VARCHAR(64)  NOT NULL UNIQUE,
  password            VARBINARY(32) NOT NULL,   -- PBKDF2-HMAC-SHA256 (310000 rounds) of the password
  salt                VARBINARY(16) NOT NULL,
  email               VARCHAR(255),
  user_type           ENUM('student', 'instructor') NOT NULL,
  display_name        VARCHAR(100),
  bio                 TEXT,
  profile_picture_url VARCHAR(500),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL UNIQUE,
  full_name  VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instructors (
  instructor_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  full_name     VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
  course_id      INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id  INT NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT NOT NULL,
  price          DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  duration_weeks INT,
  status         ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  image_url      VARCHAR(500),
  category       VARCHAR(100),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrolledcourses (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id    INT NOT NULL,
  course_id     INT NOT NULL,
  status        ENUM('in_progress', 'completed', 'dropped') NOT NULL DEFAULT 'in_progress',
  progress      INT NOT NULL DEFAULT 0,          -- percent
  rating        TINYINT NULL,                    -- 1-5
  feedback      TEXT NULL,
  enrolled_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY one_enrollment (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(course_id)   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content (
  content_id   INT AUTO_INCREMENT PRIMARY KEY,
  course_id    INT NOT NULL,
  file_name    VARCHAR(255) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  file_data    LONGBLOB NOT NULL,
  uploaded_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
