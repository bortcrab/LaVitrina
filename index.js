const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const validateJWT = require('./utils/validateJWT.js');
const corsConfig = require('./utils/validateCORS.js');
const publicacionesRouter = require('./routes/publicacionesRouter.js');
const usuariosRouter = require('./routes/usuariosRouter.js');
const chatsRouter = require('./routes/chatsRouter.js')
const reseniasRouter = require('./routes/reseniasRouter.js');
const { AppError, globalErrorHandler } = require('./utils/appError.js');

const app = express();

app.use(corsConfig);
app.use(express.json());
app.use(morgan('combined'));


app.use('/api/publicaciones', publicacionesRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/resenias', reseniasRouter);
app.use('/api/chats', validateJWT, chatsRouter)

app.use((req, res, next) => {
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en el servidor`, 404);
    next(error);
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});