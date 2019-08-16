import express from 'express';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';

import apiRouter from './api';
import config from './config';

// Express Setup
const server = express();

// Sass Middleware
server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));

// EJS Setup
server.set('view engine', 'ejs');

server.get('/', (request, response) => {
  response.render('index', {
    content: '...'
  });
});

server.use('/api', apiRouter);
server.use(express.static('public'));

server.listen(config.port, () => {
  console.info(`Express listening on port ${config.port}`);
});
