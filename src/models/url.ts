import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  redirectUrl: {
    type: String,
    required: true,
  },
  clickHistory: [
    {
      timeStamp: {
        type: Number,
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // <-- This should match the model name used in `mongoose.model('User', ...)`
  },
});

export const Url = mongoose.model('url', urlSchema);
