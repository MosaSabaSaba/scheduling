import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

const shiftSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    require <boltArtifact id="job-scheduling-app-setup-continued" title="Job Scheduling App Setup (Continued)">
  }
}
)