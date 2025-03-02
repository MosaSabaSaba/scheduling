import express from 'express';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { auth, manager } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private/Manager
router.post('/', [auth, manager], async (req, res) => {
  try {
    const { name, email, phone, position, notes, availability } = req.body;
    
    // Check if employee with this email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    
    // Create new employee
    const newEmployee = new Employee({
      name,
      email,
      phone,
      position,
      notes,
      availability
    });
    
    const employee = await newEmployee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private/Manager
router.put('/:id', [auth, manager], async (req, res) => {
  try {
    const { name, email, phone, position, notes, availability } = req.body;
    
    // Build employee object
    const employeeFields = {};
    if (name) employeeFields.name = name;
    if (email) employeeFields.email = email;
    if (phone) employeeFields.phone = phone;
    if (position) employeeFields.position = position;
    if (notes) employeeFields.notes = notes;
    if (availability) employeeFields.availability = availability;
    
    // Update employee
    let employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    );
    
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private/Manager
router.delete('/:id', [auth, manager], async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    await employee.deleteOne();
    
    res.json({ message: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;