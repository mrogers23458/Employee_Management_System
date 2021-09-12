const iq = require('inquirer')
const mysql = require('mysql2');
const { exit } = require('process');
const pass = require('../../pass/pass')
const cTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: pass,
        database: 'employees_db'
    },
    console.log('Connected to the employees_db database')
);

const empDbQuery = function (){
    let test = ['one', 'two', 'three']
    return test
}
const initPrompt = [{
    type: "list",
    name: "initAction",
    message: "what would you like to do?",
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit application']
}]

const departmentPrompt = [{
    type: "list",
    name: "depName",
    message: "What is the name of the department?",
    choices: ['Service', 'Sales', 'Engineering', 'Legal', 'Finance']
}]

const rolePrompt = [{
    type: "input",
    name: "roleName",
    message: "What is the name of the role?"
},{
    type: "number",
    name: "salary",
    message: "What is the salary for this role?"
},{
    type: "list",
    name: "depRole",
    choices: ['Service', 'Sales', 'Engineering', 'Legal', 'Finance']
}]

const employeePrompt = [{
    type: "input",
    name: "empfName",
    message: "What is the employee's first name?"
},{
    type: "input",
    name: "emplName",
    message: "What is the employee's last name?" 
},{
    type: "input",
    name: "empRole",
    message: "What is the employee's role?"
},{
    type: "input",
    name: "empMan",
    message: "Who is the employee's manager?"
}]

const updatePrompt = [{
    type: "list",
    name: "update",
    message: "Which employee's role did you want to update?",
    choices: empDbQuery
}]

const deptQuery = async() => {
    const res = await iq.prompt(departmentPrompt)
    console.log(res.depName)
    db.query(`INSERT INTO department (name) VALUES ("${res.depName}")`)
    init();
    
}

const roleQuery = async() => {
    const res = await iq.prompt(rolePrompt)
    console.log(res.roleName)
    console.log(res.salary)
    console.log(res.depRole)

    if (res.depRole === 'Service'){
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", ${res.salary}, 1)`)

        console.log('data added to table role')
    } else if (res.depRole === 'Sales'){
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", ${res.salary}, 2)`)

        console.log('data added to table role')
    } else if (res.depRole === 'Engineering'){
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", ${res.salary}, 3)`)

        console.log('data added to table role')
    } else if (res.depRole === 'Legal'){
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", ${res.salary}, 4)`)

        console.log('data added to table role')
    } else if (res.depRole === 'Finance'){
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", ${res.salary}, 5)`)

        console.log('data added to table role')
    }

}

const empQuery = async() => {
    const res = await iq.prompt(employeePrompt)
    console.log(res.empfName)
    console.log(res.emplName)
    console.log(res.empRole)
    console.log(res.empMan)

}

const updateQuery = async () => {
    const res = await iq.prompt(updatePrompt)
    console.log(res.update)
}
const init = async() => {
    const res = await iq.prompt(initPrompt)
    console.log(initPrompt);
//runs a query to employees_db and returns all information from table department
    if (res.initAction === 'view all departments'){
        console.log('view all departments')
        db.query('SELECT * FROM department', function (err, results){
            console.log(results)
            console.table(results)
            init();
        })
    }
//runs a query to employees_db and returns all information from table role
    if (res.initAction === 'view all roles'){
        console.log('view all departments')
        db.query('SELECT * FROM role JOIN department ON role.department_id = department.id ', function (err, results){
            console.log(results)
            console.table(results)
            init();
        })
    }
//runs a query to employees_db and returns all information from table employee
    if (res.initAction === 'view all employees'){
        console.log('view all departments')
        db.query('SELECT * FROM employee', function (err, results){
            console.log(results)
        })
    }
//runs function to query database with an insertion into table department
    if (res.initAction === 'add a department'){
        console.log('running department prompt...')
        deptQuery();
    }
//runs function to query database with an insertion into table role
    if (res.initAction === 'add a role'){
        console.log('running role prompt...')
        roleQuery();
    }
//runs function to query database with an insertion into table employee
    if (res.initAction === 'add an employee'){
        console.log('running employee prompt...')
        empQuery();
    }
//runs function to query database with a SET WHERE update FROM table employee
    if (res.initAction === 'update an employee role'){
        console.log('running update prompt...')
        updateQuery();
    }
    if (res.initAction === 'exit application'){
        return exit()
    }
    return
}

init();
