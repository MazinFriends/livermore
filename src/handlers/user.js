const util = require('../util');

const login = (req, reply) => {
  const { username, password } = req.query;
  const user = {
    username,
  };

  util.findUser(user, (findUserErr, savedUser) => {
    if (findUserErr) {
      return reply('Database error!').code(500);
    } else if (savedUser) {
      return util.comparePassword(password, savedUser.password, (compareErr, isAuthenticated) => {
        if (compareErr) {
          return reply('Bcrypt error!').code(500);
        } else if (isAuthenticated) {
          const EXPIRES_IN = '1d';
          const payload = {
            iss: process.env.ISSUER,
            username,
          };
          return reply(util.createJWT(payload, EXPIRES_IN));
        }
        return reply('Unauthorized.').code(403);
      });
    }

    return reply('No user found!').code(404);
  });
};

const signup = (req, reply) => {
  const { username, password } = req.payload;
  util.hashPassword(password, (hashErr, hashedPassword) => {
    if (hashErr) {
      return reply('Hash error!').code(500);
    }

    const user = {
      password: hashedPassword,
      username,
    };

    return util.findUser({ username }, (findUserErr, existingUser) => {
      if (findUserErr) {
        return reply('Database error!').code(500);
      } else if (existingUser) {
        return reply('User already exists.').code(409);
      }

      return util.saveUser(user, (saveUserErr) => {
        if (saveUserErr) {
          return reply('Database error!').code(500);
        }

        const EXPIRES_IN = '1d';
        const payload = {
          iss: process.env.ISSUER,
          username,
        };
        return reply(util.createJWT(payload, EXPIRES_IN));
      });
    });
  });
};

module.exports = {
  login,
  signup,
};
