const Good = require('good');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Package = require('../package.json');
const routes = require('./routes');
const Vision = require('vision');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT });

const plugins = [
  Inert,
  Vision, {
    options: {
      info: {
        title: 'Ulsan - JWT Authentication API Documentation',
        version: Package.version,
      },
    },
    register: HapiSwagger,
  }];

if (process.env.NODE_ENV !== 'test') {
  plugins.push({
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
  });
}

server.register(plugins, (pluginErr) => {
  if (pluginErr) {
    server.log(pluginErr);
    throw pluginErr;
  }

  routes.forEach((route) => {
    server.route(route);
  });

  if (process.env.NODE_ENV !== 'test') {
    server.start((startErr) => {
      if (startErr) {
        server.log(startErr);
        throw startErr;
      }

      server.log(['info'], `Server running at: ${server.info.uri}`);
    });
  }
});

module.exports = server;
