drop DATABASE if EXISTS datacore_db;
CREATE DATABASE IF NOT EXISTS datacore_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE datacore_db;

CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    MS              VARCHAR(20)  UNIQUE,
    bk_net_id       VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    role            ENUM('TUTOR','STUDENT') NOT NULL,
    faculty         VARCHAR(150),
    major           VARCHAR(150),
    phone_number    VARCHAR(30),
    gpa             DECIMAL(3,2),
    year_of_study   INT,
    qualifications  TEXT,
    status          ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (
    bk_net_id, MS, email, full_name, role,
    faculty, major, phone_number,
    gpa, year_of_study, qualifications
) VALUES
-- Tutors
('a.nguyenvan',111111, 'tutor001@hcmut.edu.vn', 'Nguyễn Văn A', 'TUTOR',
 'Computer Science', 'Software Engineering', '0901111111',
 NULL, NULL, 'MSc in Computer Science, 5 years teaching experience'),

('b.tranthi', 222222, 'tutor002@hcmut.edu.vn', 'Trần Thị B', 'TUTOR',
 'Computer Science', 'Artificial Intelligence', '0902222222',
 NULL, NULL, 'PhD in AI, Google AI Residency, 3 publications'),

('c.levan', 333333, 'tutor003@hcmut.edu.vn', 'Lê Văn C', 'TUTOR',
 'Electrical Engineering', 'Electronics', '0903333333',
 NULL, NULL, 'BEng in Electronics, Industry expert with 8 years experience'),

('d.phamthi', 444444, 'tutor004@hcmut.edu.vn', 'Phạm Thị D', 'TUTOR',
 'Mechanical Engineering', 'Robotics', '0904444444',
 NULL, NULL, 'MEng in Robotics, Research in autonomous systems'),

-- Students
('e.hoangvan', 2300000, 'student001@hcmut.edu.vn', 'Hoàng Văn E', 'STUDENT',
 'Computer Science', 'Software Engineering', '0905555555',
 3.2, 3, NULL),

('f.vuthi', 2300001, 'student002@hcmut.edu.vn', 'Vũ Thị F', 'STUDENT',
 'Computer Science', 'Data Science', '0906666666',
 3.8, 2, NULL),

('g.dangvan', 2300002, 'student003@hcmut.edu.vn', 'Đặng Văn G', 'STUDENT',
 'Electrical Engineering', 'Power Systems', '0907777777',
 2.9, 4, NULL),

('h.buithi', 2300003, 'student004@hcmut.edu.vn', 'Bùi Thị H', 'STUDENT',
 'Mechanical Engineering', 'Automotive', '0908888888',
 3.5, 3, NULL),

('i.ngovan', 2300004, 'student005@hcmut.edu.vn', 'Ngô Văn I', 'STUDENT',
 'Computer Science', 'Cybersecurity', '0909999999',
 3.1, 2, NULL),

('k.dothi', 2300005, 'student006@hcmut.edu.vn', 'Đỗ Thị K', 'STUDENT',
 'Computer Science', 'Software Engineering', '0911111111',
 2.7, 4, NULL),

('l.lyvan', 2300006, 'student007@hcmut.edu.vn', 'Lý Văn L', 'STUDENT',
 'Computer Science', 'Artificial Intelligence', '0912222222',
 3.9, 2, NULL),

('m.maithi', 2300007, 'student008@hcmut.edu.vn', 'Mai Thị M', 'STUDENT',
 'Electrical Engineering', 'Electronics', '0913333333',
 3.0, 3, NULL);

-- Subjects/Courses table
CREATE TABLE subjects (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(20)  NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subjects (code, name, description) VALUES
('CS101', 'Nguyen ly ngon ngu lap trinh', 'Programming Fundamentals'),
('CS102', 'Cau truc du lieu', 'Data Structures'),
('CS103', 'Lap trinh huong doi tuong', 'Object-Oriented Programming'),
('CS104', 'Co so du lieu', 'Database Systems'),
('CS105', 'Mang may tinh', 'Computer Networks'),
('CS106', 'He dieu hanh', 'Operating Systems'),
('CS107', 'Tri tue nhan tao', 'Artificial Intelligence'),
('EE101', 'Dien tu', 'Electronics'),
('ME101', 'Robot hoc', 'Robotics');

-- Tutor-Subject mapping table
CREATE TABLE tutor_subjects (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    tutor_id        BIGINT NOT NULL,
    subject_id      BIGINT NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_tutor_subject (tutor_id, subject_id)
);

INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES
-- Tutor A (a.nguyenvan) - teaches CS101, CS103
(1, 1), (1, 3),
-- Tutor B (b.tranthi) - teaches CS107, CS104
(2, 7), (2, 4),
-- Tutor C (c.levan) - teaches EE101
(3, 8),
-- Tutor D (d.phamthi) - teaches ME101
(4, 9);

-- Student Enrollment table - stores which tutor a student is enrolled with for which subject
CREATE TABLE student_enrollments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id      BIGINT NOT NULL,
    tutor_id        BIGINT NOT NULL,
    subject_id      BIGINT NOT NULL,
    enrollment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          ENUM('ACTIVE', 'COMPLETED', 'DROPPED') DEFAULT 'ACTIVE',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY uk_student_subject (student_id, subject_id)
);

