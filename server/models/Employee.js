import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  available: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: '09:00'
  },
  endTime: {
    type: String,
    default: '17:00'
  }
});

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  position: {
    type: String
  },
  notes: {
    type: String
  },
  availability: {
    monday: {
      type: availabilitySchema,
      default: () => ({})
    },
    tuesday: {
      type: availabilitySchema,
      default: () => ({})
    },
    wednesday: {
      type: availabilitySchema,
      default: () => ({})
    },
    thursday: {
      type: availabilitySchema,
      default: () => ({})
    },
    friday: {
      type: availabilitySchema,
      default: () => ({})
    },
    saturday: {
      type: availabilitySchema,
      default: () => ({})
    },
    sunday: {
      type: availabilitySchema,
      default: () => ({})
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;