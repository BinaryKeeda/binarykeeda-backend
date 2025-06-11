import mongoose, { Schema } from "mongoose";

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

const QuizSchema = new Schema({
  category: {
    type: String,
    enum: ['Aptitude', 'Miscellaneous', 'Core'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: {
    type: [String],
    default: [],
    set: tags => tags.map(tag => tag.toLowerCase())
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  title: { type: String, required: true },
    slug: { type: String, unique: true },  
  duration: { type: Number, required: true, min: 1 }, // in minutes
  questions: {
    type: [QuestionSchema],
    validate: q => Array.isArray(q) && q.length > 0
  },
  minimumScore: { type: Number, default: 0, min: 0 },
  averageScore: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  marks: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Optional: add indexes
QuizSchema.pre('validate', function(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true, // removes special characters
      trim: true
    });
  }
  next();
});

QuizSchema.index({ slug: 1 }, { unique: true });
QuizSchema.index({ category: 1 });

const Quiz = mongoose.model('Quiz', QuizSchema);
export default Quiz;
