CREATE TABLE users (
id serial PRIMARY KEY,
email text UNIQUE NOT NULL,
display_name text,
role text NOT NULL DEFAULT 'alumno',
google_refresh_token text,
google_token_expiry timestamptz,
created_at timestamptz DEFAULT now()
);


CREATE TABLE courses (
id text PRIMARY KEY,
name text,
section text,
teacher_emails text[],
last_sync timestamptz
);


CREATE TABLE enrollments (
id serial PRIMARY KEY,
user_email text REFERENCES users(email),
course_id text REFERENCES courses(id),
role text CHECK (role IN ('STUDENT','TEACHER'))
);


CREATE TABLE submissions_cache (
id serial PRIMARY KEY,
course_id text,
coursework_id text,
student_email text,
state text,
updated_at timestamptz DEFAULT now()
);
