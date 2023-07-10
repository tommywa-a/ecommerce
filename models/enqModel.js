const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var enqSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    status:{
      type: String,
      default: "Submitted",
      enum:["Submitted", "Contacted", "In Progress"],
      validateBeforeSave: true,
      validateBeforeUpdate: true
    }
});

enqSchema.pre('findByIdAndUpdate', function (next) {
  const updatedValues = this.getUpdate().$set

  if (updatedValues.status && !enqSchema.path('status').enumValues.includes(updatedValues.status)) {
    throw new Error('Invalid enum value')
  }
  next()
})

//Export the model
module.exports = mongoose.model('Enquiry', enqSchema);