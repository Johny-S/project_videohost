const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },

});

// userSchema.statics.findOne = async function (id) {
//   return this.find({ id });
// };

module.exports = mongoose.model('User', userSchema);
