// employee controllers
// set all logic for api in controllers 
// const data = {}
// data.employees = require('../model/employees.json') 

// format data and  data.employees
// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function (data) { this.employees = data}
// }

// in mongoDB using mongoose
const Employee = require('../model/Employee')
// get
const getAllEmployees = async (req, res) => {
    const employees = await Employee.find()
    if(!employees) return res.status(204).json({ 'message': 'No employees found'})
    // res.json(data.employees) // json db
    res.json(employees)
}
// post
// const createNewEmployee = (req, res) => {
//     res.json({
//         "firstName": req.body.firstName,
//         "lastName": req.body.lastName
//     })
// }

// rewrite post
const createNewEmployee = async (req, res) => {
    if(!req?.body?.firstName || !req?.body?.lastName) {
        return res.status(400).json({ 'message': 'firstName and lastName are required'});
    }
    try {
        const result = await Employee.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        res.status(201).json(result)
    }catch (err) {
        console.log(err)
    }
    // const newEmployee = {
    //     id: data.employees[data.employees.length - 1].id + 1|| 1,
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName
    // }

    // if(!newEmployee.firstName || !newEmployee.lastName) {
    //     return res.status(400).json({'message': 'FirstName and lastName are required'})
    // }
    // data.setEmployees([...data.employees, newEmployee])
    // res.status(201).json(data.employees) //status 201 for create new record complete
}

// put
// const updateEmployee = (req, res) => {
//     res.json({
//         "firstName": req.body.firstName,
//         "lastName": <req className="body lastName"></req>
//     })
// }
// rewrite put
const updateEmployee = async (req, res) => {
    // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.'})
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if(!employee) {
        // return res.status(400).json({'message': `Employee ID ${req.body.id} not found`})
        return res.status(204).json({'message': `No employee match ID ${req.body.id}`}) // change 400 to 204 cause it does not bad request it just not match with ID
    }
    if(req?.body?.firstName) employee.firstName = req.body.firstName //req.body.firstName: new firstName
    if(req?.body?.lastName) employee.lastName = req.body.lastName //req.body.lastName: new lastName
    // const filterArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // const unsortedArray = [...filterArray, employee]
    // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1: a.id < b.id ? -1 : 0));

    const result =  await employee.save()
    // res.status(200).json(data.employees)
    res.status(200).json(result)
}  
// delete
// const deleteEmployee = (req, res) => {
//     res.json({
//         "id": req.body.id
//     })
// }
// rewrite delete
// const deleteEmployee = async (req, res) => {
//     // const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
//     if(!req?.body?.id) {
//         res.status(400).json({ 'message': 'ID parameter is required.'})
//     }
//     const employee = await Employee.findOne({ _id: req.body.id })
//     if(!employee) {
//         // return res.status(400).json({'message': `Employee ID ${req.params.id} not found` })
//         return res.status(204).json({'message': `No employee match ID ${req.body.id}`})
//     }
//     // const filterArray = data.employees.filter(emp => emp.id !== req.body.id)
//     // data.setEmployees([...filterArray])
//     const result = await employee.deleteOne({ _id: req.body.id }); //{ _id: req.body.id }
//     // res.status(200).json(data.employees)
//     res.status(200).json(result)
// }
const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findByIdAndDelete({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    res.json(employee);
}

// get employee
// const getEmployee = (req, res) => {
//     res.json({
//         "id": req.params.id
//     })
// }
// rewrite get employee
const getEmployee = async (req, res) => {
    // const employee = data.employees.find(emp => emp.id === parseInt(req.params.id))
    if(!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.'})
    }
    const employee =  await Employee.findOne({  _id: req.params.id}).exec();
    if(!employee) {
        // return res.status(400).json({'message': `Employee ID ${req.params.id} not found` })
        return res.status(204).json({'message': `No employee match ID ${req.body.id}` })

    }
    res.status(200).json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee

}