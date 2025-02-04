DROP DATABASE employee_db;
CREATE DATABASE employee_db;
\c employee_db;
INSERT INTO departments (name) VALUES
('Engineering'),
('Human Resources'),
('Marketing');

-- Roles
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 90000, 1),
('HR Manager', 75000, 2),
('Marketing Coordinator', 60000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mike', 'Johnson', 3, 1);
