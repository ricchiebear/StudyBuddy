CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password VARCHAR(255),
  degree VARCHAR(100),
  session_ids VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modules (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  category_name VARCHAR(100),
  level VARCHAR(50)
);

CREATE TABLE categories (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE listings (
  listing_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  tag_id INT,
  title VARCHAR(150),
  start_time DATETIME,
  end_time DATETIME,
  location VARCHAR(150),
  status VARCHAR(50),
  module VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (tag_id) REFERENCES categories(tag_id)
  
);
CREATE TABLE listing_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT,
  tag_id INT,
  FOREIGN KEY (listing_id) REFERENCES listings(listing_id),
  FOREIGN KEY (tag_id) REFERENCES categories(tag_id)
);

CREATE TABLE streaks (
  streak_id INT AUTO_INCREMENT PRIMARY KEY,
  user1_id INT,
  user2_id INT,
  session_ids VARCHAR(255),
  start_date DATE,
  current_date DATE,
  current_count INT,
  FOREIGN KEY (user1_id) REFERENCES users(user_id),
  FOREIGN KEY (user2_id) REFERENCES users(user_id)
);
