export const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Server Error:' , err);

    if(err.name === 'ZODERROR'){
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
};