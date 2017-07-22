// const bodyParser = require('body-parser');
// const express = require('express');
// const util = require('./util');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');

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
      },
    },
    register: HapiSwagger,
  }], (pluginErr) => {
  if (pluginErr) {
    throw pluginErr;
  }

  routes.forEach((route) => {
    server.route(route);
  });

  server.start((startErr) => {
    if (startErr) {
      throw startErr;
    }

    console.log(`Server running at: ${server.info.uri}`);
  });
});


// disable x-powered-by for security

// app.disable('x-powered-by');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// app.post('/signup', (req, res) => {
//   const { username, password } = req.query;
//   util.hashPassword(password, (hashErr, hashedPassword) => {
//     if (hashErr) {
//       return res.status(500).send('Hash error!');
//     }

//     const user = {
//       password: hashedPassword,
//       username,
//     };

//     return util.findUser({ username }, (findUserErr, existingUser) => {
//       if (findUserErr) {
//         return res.status(500).send('Database error!');
//       } else if (existingUser) {
//         return res.status(403).send('User already exists.');
//       }

//       return util.saveUser(user, (saveUserErr, savedUser) => {
//         if (saveUserErr) {
//           return res.status(500).send('Database error!');
//         }

//         return res.send(savedUser);
//       });
//     });
//   });
// });

// app.get('/login', (req, res) => {
//   const { username, password } = req.query;
//   const user = {
//     username,
//   };

//   util.findUser(user, (findUserErr, savedUser) => {
//     if (findUserErr) {
//       return res.status(500).send('Database error!');
//     } else if (savedUser) {
//       return util.comparePassword(password, savedUser.password, (compareErr, isAuthenticated) => {
//         if (compareErr) {
//           return res.status(500).send('Bcrypt error!');
//         } else if (isAuthenticated) {
//           const EXPIRES_IN = '1d';
//           const payload = {
//             iss: process.env.hostname,
//             username,
//           };
//           return res.json(util.createJWT(payload, EXPIRES_IN));
//         }
//         return res.status(401).send('Unauthorized.');
//       });
//     }

//     return res.status(403).send('No user found!');
//   });
// });

// app.listen(port, () => {
//   console.log(`Livermore auth server is listening to port ${port}`);
// });

// module.exports = app;
