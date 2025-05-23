const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); // Import the plugin

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  phone: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true, // Ensure registration number is unique
  },
  branch: {
    type: String,
    required: true,
    enum: ["CSE", "CE", "IT", "SFE", "ME", "EEE", "EC"], // Restrict to specific values
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8, // Restrict to semesters 1-8
  },
  yearOfAdmission: {
    type: Number,
    required: true,
    min: 2020, // Minimum year of admission
    max: new Date().getFullYear(), // Maximum year of admission (current year)
  },
  lastSemGPA: {
    type: Number,
    required: true,
    min: 0,
    max: 10, // GPA range validation
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10, // CGPA range validation
  },
  backlog: {
    type: Number,
    required: true,
    min: 0,
    default: 0, // Default value is 0 backlogs
  },
  feeDue: {
    type: String,
    required: true,
    enum: ["Yes", "No"], // Restrict to "Yes" or "No"
  },
  fatherName: {
    type: String,
    required: true,
  },
  verified: {
    type: String,
    enum: ["Yes", "No"], // Restrict to "Yes" or "No"
    default: "No", // Default value is "No"
  },
  // Placement fields
  isPlaced: {
    type: Boolean,
    default: false,
  },
  placementCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
  placementPackage: {
    type: Number,
    default: null,
  },
  placementDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

// Apply the passport-local-mongoose plugin to the schema
studentSchema.plugin(passportLocalMongoose);

// Create the Mongoose model
const cse = mongoose.model("ComputerScience", studentSchema);

module.exports = cse;
