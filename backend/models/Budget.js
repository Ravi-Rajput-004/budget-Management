import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add a budget amount']
  },
  month: {
    type: Number,
    required: true,
    default: () => new Date().getMonth() + 1
  },
  year: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  threshold: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user ID']
  }
}, {
  timestamps: true
});

export default mongoose.model('Budget', budgetSchema);
