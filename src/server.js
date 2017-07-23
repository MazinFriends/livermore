const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');
const Package = require('../package.json');

const server = new Hapi.Server();
const routes = require('./routes');

server.connection({ port: process.env.PORT });

server.register([
  Inert,
  Vision, {
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            log: '*',
          }],
        }, {
          module: 'good-console',
        }, 'stdout'],
      },
    },
  }, {
    options: {
      info: {
        title: 'Ulsan - JWT Authentication API Documentation',
        version: Package.version,
      },
    },
    register: HapiSwagger,
  }], (pluginErr) => {
  if (pluginErr) {
    server.log(pluginErr);
    throw pluginErr;
  }

  routes.forEach((route) => {
    server.route(route);
  });

  server.start((startErr) => {
    if (startErr) {
      server.log(startErr);
      throw startErr;
    }

    server.log(['info'], `Server running at: ${server.info.uri}`);
  });
});
