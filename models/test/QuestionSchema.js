import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const OptionSchema = new Schema({
  text: { type: String, required: false },
  image: { type: String, required: false },
  isCorrect: { type: Boolean, default: false }
});

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  image: { type: String, required: false, sparse: true },
  marks: { type: Number, required: true, min: 0 },
  negative: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ["MCQ", "MSQ", "Text"],
    default: "MCQ"
  },
  answer: { type: String, required: function() { return this.category === "Text"; } },
  options: {
    type: [OptionSchema],
    default: [],
    validate: {
      validator: function(arr) {
        return this.category === 'Text' || (Array.isArray(arr) && arr.length >= 2);
      },
      message: 'Options must have at least 2 entries for MCQ/MSQ.'
    }
  }
});

export  {QuestionSchema};
// export const Question = mongoose.model('Question', QuestionSchema);
