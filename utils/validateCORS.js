const cors = require('cors');
const { AppError } = require('../utils/appError.js');

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGINS.split(',') : [];

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback((new AppError('Este origen no está permitido por CORS.', 403)));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);