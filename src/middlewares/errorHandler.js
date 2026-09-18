const errorHandler = (err, req, res, next) => {
    console.error(`[Error Handler] ${err.name || 'Error'}: ${err.message}`);

    const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

    res.status(statusCode).json({
        error: err.message || 'Erro interno no servidor.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
