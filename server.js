import express from 'express';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import bodyParser from 'body-parser';

import serverRender from './serverRender';
import apiRouter from './api';
import config from './config';

// Express Setup
const server = express();

// Body Parser
server.use(bodyParser.json());

// Sass Middleware
server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));

// EJS Setup
server.set('view engine', 'ejs');

server.get(['/', '/contest/:contestId'], (request, response) => {
  serverRender(request.params.contestId)
    .then(({ initialMarkup, initialData }) => {
      response.render('index', { initialMarkup, initialData });
    })
    .catch(error => {
      console.error(error);
      response.status(404).send('Bad Request');
    });
});

server.use('/api', apiRouter);
server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info(`Express listening on port ${config.port}`);
});
