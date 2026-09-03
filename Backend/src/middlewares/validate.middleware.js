import { validationResult, body } from "express-validator";

// Execute validation rules and return validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};


// User registration validation
export const userValidationRules = () => [
    // Name: 10-60 characters
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 10, max: 60 })
        .withMessage("Name must be between 10 and 60 characters long."),

    // Email
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Must be a valid email address.")
        .normalizeEmail(),

    // Password: 8-16 characters,
    // at least one uppercase and one special character
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters long.")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
        .withMessage(
            "Password must include at least one uppercase letter and one special character."
        ),

    // Address: maximum 400 characters
    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required.")
        .isLength({ max: 400 })
        .withMessage("Address cannot exceed 400 characters.")
];


// Update password validation
export const updatePasswordValidationRules = () => [
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8, max: 16 })
        .withMessage(
            "New password must be between 8 and 16 characters long."
        )
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
        .withMessage(
            "New password must include at least one uppercase letter and one special character."
        )
];


// Rating validation
export const ratingValidationRules = () => [
    body("rating")
        .notEmpty()
        .withMessage("Rating is required.")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5.")
];