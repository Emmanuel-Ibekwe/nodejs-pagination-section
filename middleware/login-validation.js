const { body } = require("express-validator");

function isStrongPassword(password) {
  const regex = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return regex.test(password);
}

module.exports = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("password")
    .custom((value, { req }) => {
      if (!isStrongPassword(value)) {
        throw new Error(
          "Password must be at least 8 characters long and contain one lowercase letter, one number, and one special character."
        );
      }

      return true;
    })
    .trim()
];
