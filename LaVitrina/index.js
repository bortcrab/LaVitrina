const { exec } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const http = require('http'); 
const { Server } = require('socket.io');
const validateJWT = require('./utils/validateJWT.js');
const corsConfig = require('./utils/validateCORS.js');
const publicacionesRouter = require('./routes/publicacionesRouter.js');
const subastasRouter = require('./routes/subastasRouter.js');
const usuariosRouter = require('./routes/usuariosRouter.js');
const chatsRouter = require('./routes/chatsRouter.js')
const reseniasRouter = require('./routes/reseniasRouter.js');
const categoriasRouter = require('./routes/categoriasRouter.js');
const pujasRouter = require('./routes/pujasRouter.js');
const { AppError, globalErrorHandler } = require('./utils/appError.js');
const SocketController = require('./controllers/socketController.js');
const ubicacionRouter = require('./routes/ubicacionRouter.js');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : "*",
        methods: ["GET", "POST"]
    }
});
new SocketController(io);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(corsConfig);
app.use(express.json());
app.use(morgan('combined'));


const frontendPath = path.join(__dirname, '../FRONTLAVITRINA');
app.use(express.static(frontendPath));

app.use('/api/publicaciones', validateJWT, publicacionesRouter);
app.use('/api/subastas', validateJWT, subastasRouter);
app.use('/api/ubicacion', ubicacionRouter);
app.use('/api/usuarios',  usuariosRouter);
app.use('/api/resenias', validateJWT, reseniasRouter);
app.use('/api/chats', validateJWT, chatsRouter);
app.use('/api/categorias', validateJWT, categoriasRouter);
app.use('/api/pujas',validateJWT, pujasRouter);

app.get(/(.*)/, (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((req, res, next) => {
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en el servidor`, 404);
    next(error);
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);

    const url = `http://localhost:${PORT}`;
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    
    exec(start + ' ' + url, (error) => {
        if (error) {
            console.error('No se pudo abrir el navegador automáticamente:', error);
        }
    });
});