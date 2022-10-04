const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Строка должна содержать как минимум 2 символа'],
    maxlength: [30, 'Строка не должна первышать 30 символов'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
