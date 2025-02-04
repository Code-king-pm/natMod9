import inquirer from "inquirer";
import { db } from "./db/connection.js";
async function startApp() {
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "Exit",
            ],
        },
    ]);
    switch (choice) {
        case "View All Departments":
            await viewDepartments();
            break;
        case "View All Roles":
            await viewRoles();
            break;
        case "View All Employees":
            await viewEmployees();
            break;
        case "Add a Department":
            await addDepartment();
            break;
        case "Add a Role":
            await addRole();
            break;
        case "Add an Employee":
            await addEmployee();
            break;
        case "Update an Employee Role":
            await updateEmployeeRole();
            break;
        case "Exit":
            console.log("Goodbye!");
            process.exit();
            return;
    }
    await startApp();
}
async function viewDepartments() {
    try {
        const result = await db.query(`SELECT id AS "ID", name AS "Department Name" FROM departments`);
        console.table(result.rows);
    }
    catch (error) {
        console.error("Error fetching departments:", error);
    }
}
async function viewRoles() {
    try {
        const result = await db.query(`SELECT roles.id AS "ID", roles.title AS "Job Title", departments.name AS "Department", roles.salary AS "Salary"
      FROM roles
      JOIN departments ON roles.department_id = departments.id`);
        console.table(result.rows);
    }
    catch (error) {
        console.error("Error fetching roles:", error);
    }
}
async function viewEmployees() {
    try {
        const result = await db.query(`
      SELECT employees.id AS "ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", 
      roles.title AS "Job Title", departments.name AS "Department", roles.salary AS "Salary", 
      COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'None') AS "Manager"
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    `);
        console.table(result.rows);
    }
    catch (error) {
        console.error("Error fetching employees:", error);
    }
}
async function addDepartment() {
    const { departmentName } = await inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Enter the department name:",
        },
    ]);
    await db.query("INSERT INTO departments (name) VALUES ($1)", [departmentName]);
    console.log(`Added ${departmentName} to the database.`);
}
async function addRole() {
    const { title, salary, department_id } = await inquirer.prompt([
        { type: "input", name: "title", message: "Enter the role title:" },
        { type: "input", name: "salary", message: "Enter the role salary:" },
        { type: "input", name: "department_id", message: "Enter the department ID:" },
    ]);
    await db.query("INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)", [title, salary, department_id]);
    console.log(`Added ${title} to the database.`);
}
async function addEmployee() {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: "input", name: "first_name", message: "Enter the employee's first name:" },
        { type: "input", name: "last_name", message: "Enter the employee's last name:" },
        { type: "input", name: "role_id", message: "Enter the role ID:" },
        { type: "input", name: "manager_id", message: "Enter the manager ID (or leave blank):", default: null },
    ]);
    const managerIdValue = manager_id === "" ? null : manager_id;
    await db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [first_name, last_name, role_id, managerIdValue]);
    console.log(`Added ${first_name} ${last_name} to the database.`);
}
async function updateEmployeeRole() {
    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: "input",
            name: "employeeId",
            message: "Enter the employee ID to update: ",
        },
        {
            type: "input",
            name: "newRoleId",
            message: "Enter the new role ID: ",
        },
    ]);
    try {
        const query = `UPDATE employees SET role_id = $1 WHERE id = $2`;
        const result = await db.query(query, [Number(newRoleId), Number(employeeId)]);
        console.log(`${result.rowCount} row(s) updated.`);
    }
    catch (err) {
        console.error("Error updating employee role:", err);
    }
}
startApp();
