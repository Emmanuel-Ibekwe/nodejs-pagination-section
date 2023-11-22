const { body } = require("express-validator");

module.exports = [
  body("title", "title must be at least 3 characters long.")
    .isString()
    .isLength({ min: 3 })
    .trim(),

  body("price", "Price must be a number.").isFloat(),
  body("description", "description must be at least 5 characters long.")
    .isLength({ min: 5, max: 400 })
    .trim()
];
