import express from 'express';
import Shift from '../models/Shift.js';
import { auth, manager } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/shifts
// @desc    Get all shifts (with optional date range filter)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    // Add date range filter if provided
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // If not a manager, only show shifts for the current user
    if (req.user.role !== 'manager') {
      query.employeeId = req.user.id;
    }
    
    const shifts = await Shift.find(query).sort({ startTime: 1 });
    res.json(shifts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/shifts/:id
// @desc    Get shift by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    // Check if user has permission to view this shift
    if (req.user.role !== 'manager' && shift.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this shift' });
    }
    
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/shifts
// @desc    Create a new shift
// @access  Private/Manager
router.post('/', [auth, manager], async (req, res) => {
  try {
    const { employeeId, startTime, endTime, notes } = req.body;
    
    // Create new shift
    const newShift = new Shift({
      employeeId,
      startTime,
      endTime,
      notes
    });
    
    const shift = await newShift.save();
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shifts/:id
// @desc    Update a shift
// @access  Private/Manager
router.put('/:id', [auth, manager], async (req, res) => {
  try {
    const { employeeId, startTime, endTime, notes } = req.body;
    
    // Build shift object
    const shiftFields = {};
    if (employeeId) shiftFields.employeeId = employeeId;
    if (startTime) shiftFields.startTime = startTime;
    if (endTime) shiftFields.endTime = endTime;
    if (notes !== undefined) shiftFields.notes = notes;
    
    // Update shift
    let shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { $set: shiftFields },
      { new: true }
    );
    
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/shifts/:id
// @desc    Delete a shift
// @access  Private/Manager
router.delete('/:id', [auth, manager], async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    await shift.deleteOne();
    
    res.json({ message: 'Shift removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/shifts/:id/swap-request
// @desc    Request a shift swap
// @access  Private
router.post('/:id/swap-request', auth, async (req, res) => {
  try {
    const { requestedTo, notes } = req.body;
    
    const shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    // Check if user is the owner of the shift or a manager
    if (req.user.role !== 'manager' && shift.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to request swap for this shift' });
    }
    
    // Add swap request
    shift.swapRequests.push({
      requestedBy: req.user.id,
      requestedTo,
      notes
    });
    
    await shift.save();
    
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shifts/:id/swap-request/:swapId
// @desc    Respond to a shift swap request
// @access  Private
router.put('/:id/swap-request/:swapId', auth, async (req, res) => {
  try {
    const { approved } = req.body;
    
    const shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    // Find the swap request
    const swapRequest = shift.swapRequests.id(req.params.swapId);
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }
    
    // Check if user is the requested employee or a manager
    if (req.user.role !== 'manager' && swapRequest.requestedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this swap request' });
    }
    
    // Update swap request status
    swapRequest.status = approved ? 'approved' : 'rejected';
    
    // If approved, swap the employees
    if (approved) {
      const originalEmployeeId = shift.employeeId;
      shift.employeeId = swapRequest.requestedTo;
      
      // Create a new shift for the original employee (optional)
      // This would be implemented based on business requirements
    }
    
    await shift.save();
    
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Shift or swap request not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;