const express = require('express');
const morgan = require('morgan');
const publicacionesRouter = require('./routes/publicacionesRouter.js');
const { AppError } = require('./utils/appError.js');

const app = express();

app.use(express.json());

app.use(morgan('combined'));

app.use('/api/publicaciones', publicacionesRouter);

app.use((req, res, next) => {
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en el servidor`, 404);
    next(error);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})