import React from 'react';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';

import App from './src/components/App';
import config from './config';

const serverRender = () =>
  axios.get(`${config.serverUrl}/api/contests`)
    .then(response => {
      return {
        initialMarkup: ReactDOMServer.renderToString(<App initialContests={response.data.contests} />),
        initialData: response.data
      };     
    })
    .catch(console.error);

export default serverRender;
