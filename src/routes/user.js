const Joi = require('joi');
const handlers = require('../handlers/user');

const routes = [{
  config: {
    description: 'User login',
    handler: handlers.login,
    notes: 'Authenticates user with username and password and issues JWT',
    tags: ['api'],
    validate: {
      query: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
    },
  },
  method: 'GET',
  path: '/user',
}, {
  config: {
    description: 'User signup',
    handler: handlers.signup,
    notes: 'Signs up user with username and password',
    tags: ['api'],
    validate: {
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
    },
  },
  method: 'POST',
  path: '/user',
}, {
  config: {
    description: 'User delete',
    handler: handlers.deleteUser,
    notes: 'Deletes user with username and password',
    tags: ['api'],
    validate: {
      query: {
        username: Joi.string().required(),
        password: Joi.string().required(),
      },
    },
  },
  method: 'DELETE',
  path: '/user',
}];

module.exports = routes;
