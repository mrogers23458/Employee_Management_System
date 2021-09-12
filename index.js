const iq = require('inquirer')
const empDbQuery = function (){
    let test = ['one', 'two', 'three']
    return test
}
const initPrompt = [{
    type: "list",
    name: "initAction",
    message: "what would you like to do?",
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
}]

const departmentPrompt = [{
    type: "input",
    name: "depName",
    message: "What is the name of the department?"
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

iq.prompt(updatePrompt)
