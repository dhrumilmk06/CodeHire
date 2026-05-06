/**
 * Request Validation Middleware using Zod
 */

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error.name === "ZodError") {
            const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            const err = new Error(`Validation Error: ${issues}`);
            err.status = 422;
            return next(err);
        }
        next(error);
    }
};

export default validate;

