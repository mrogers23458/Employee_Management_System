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

const empDbQuery = function () {
    let test = []
    test.push('one', 'two', 'three')

    db.query('SELECT CONCAT (employee.first_name, " ", employee.last_name) as name FROM employee;')

    return test
}

const newQuery = function (){
    db.query('SELECT * FROM department', function (err, results){
        console.log(results)
        console.table(results)
    })
}

const initPrompt = [{
    type: "list",
    name: "initAction",
    message: "what would you like to do?",
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit application']
}]

const departmentPrompt = [{
    type: "input",
    name: "depName",
    message: "What is the name of the department?",
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


const deptQuery = async() => {
    const res = await iq.prompt(departmentPrompt)
    console.log(res.depName)
    db.query(`INSERT INTO department (name) VALUES ("${res.depName}")`)
    init();
    
}

const roleQuery = async(data) => {
    const res = await iq.prompt([{
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
        choices: data
    }])

    var roleID = data.find(element => {
        return element.name === res.depRole
    })
    console.log(roleID)
    console.log(res.depRole)
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", "${res.salary}", ${roleID.id})`, function (err, res) {
        init()
    })
}

const empQuery = async(data, data2) => {
    console.log('----------------------DATA')
    console.log(data)
    console.log('DATA2-----------------------------------')
    console.log(data2)
    const res = await iq.prompt([{
        type: "input",
        name: "empfName",
        message: "What is the employee's first name?"
    },{
        type: "input",
        name: "emplName",
        message: "What is the employee's last name?" 
    },{
        type: "list",
        name: "empRole",
        message: "What is the employee's role?",
        choices: data2
        
    },{
        type: "list",
        name: "empMan",
        message: "Who is the employee's manager?",
        choices: data
    }])

    var hasManager = data.find(element => {
        return element.name === res.empMan
    })
    console.log(hasManager.id)

    var hasRole = data2.find(el => {
        console.log('element below------')
        console.log(el)
        return el.name === res.empRole
    })
    console.log(hasRole.id)

    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.empfName}", "${res.emplName}", ${hasRole.id}, ${hasManager.id})`, function (err, res) {
        init()
    })
}

const updateQuery = async (data) => {
   const res = await iq.prompt({
        type: 'list',
        name: 'updateEmp',
        message: 'Which employee would you like to update?',
        choices: data
    })
    console.log(data)
    console.log(res.updateEmp)
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
        db.query('SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id ', function (err, results){
            console.log(results)
            console.table(results)
            init();
        })
    }
//runs a query to employees_db and returns all information from table employee
    if (res.initAction === 'view all employees'){
        console.log('view all departments')
        db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(Manager.first_name, " ", Manager.last_name) as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id LEFT JOIN employee as Manager ON employee.manager_id = Manager.id', function (err, results){
            console.log(results)
            console.table(results)
            init();
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
        db.query('SELECT * FROM department', function (err, res) {
            roleQuery(res);
        })
        
    }
//runs function to query database with an insertion into table employee
    if (res.initAction === 'add an employee'){
        console.log('running employee prompt...')
        db.query('SELECT CONCAT (employee.first_name, " ", employee.last_name) as name, employee.id FROM employee WHERE manager_id IS NULL' , function (err, res) {
            db.query('SELECT title as name, id FROM role', function(err, res2){
                empQuery(res, res2)
            })
            
        })
        
    }
//runs function to query database with a SET WHERE update FROM table employee
    if (res.initAction === 'update an employee role'){
        console.log('running update prompt...')
        db.query('SELECT employee.first_name as name FROM employee', function (err, res) {
            updateQuery(res)
        })
    }
    if (res.initAction === 'exit application'){
        return exit()
    }
    return
}

init();
