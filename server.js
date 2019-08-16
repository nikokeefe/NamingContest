import express from 'express';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';

import serverRender from './serverRender';
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
  serverRender()
    .then(({ initialMarkup, initialData }) => {
      response.render('index', { initialMarkup, initialData });
    })
    .catch(console.error);
});

server.use('/api', apiRouter);
server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info(`Express listening on port ${config.port}`);
});
