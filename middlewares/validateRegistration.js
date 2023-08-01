const { body, validationResult } = require("express-validator");

// const signup_validation={ 
//   validateRegistration : [
//   body("name").trim().not().isEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Invalid email address"),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters"),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ],
// }

const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


const authmiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const secretKey = 'your-secret-key'; // Replace this with your own secret key
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const checkRole = (role) => (req, res, next) => {
  if (req.userRole !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
module.exports = {
  validateRegistration,
  validateLogin,
  authmiddleware,
  checkRole,
  };
