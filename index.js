const express = require('express');
const morgan = require('morgan');
const publicacionesRouter = require('./routes/publicacionesRouter.js');
const usauriosRouter = require('./routes/usuariosRouter.js');
const chatsRouter = require('./routes/chatsRouter.js')
const { AppError, globalErrorHandler } = require('./utils/appError.js');


const app = express();

app.use(express.json());

app.use(morgan('combined'));

app.use('/api/publicaciones', publicacionesRouter);
app.use('/api/chats', chatsRouter)

app.use('/api/usuarios', usauriosRouter);

app.use((req, res, next) => {
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en el servidor`, 404);
    next(error);
});

app.use(globalErrorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})