const validator = require('validator');
const { FORMAT_LINK_ERROR_MESSAGE } = require('./constants');

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message(FORMAT_LINK_ERROR_MESSAGE);
};

module.exports = {
  validateUrl,
};
