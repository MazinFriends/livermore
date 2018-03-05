/* eslint-disable */

// TODO - Decide on where/how to put process.env variables
process.env.MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || 'localhost';
process.env.MONGO_PORT = process.env.MONGO_PORT || 27017;
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'sampleJwtSecret';

const hapiTest = require('hapi-test');
const {assert, expect} = require('chai');
const server = require('../src/server');
const User = require('../src/db/user_model');

// TODO - Decide on which username/password to use to test
const username = 'gUPuyxbnuSZXviBoFaPAhGnssIHDMMivLpp6am6zGWw2Oi7SDwjjTnWAEChKhAC5cWfho0VxayDI5UDpC37YrpmRNxSx9ksDghaK';
const password = 'real';

const fakeUsername = '5Q6mSb8OKev7Tkh3jMWp54IPhoF36nS9yPu7LmZoUljRB5s15Q8kEJfVfNsvYUyR9PHfZlbVALm83PwZWbKgKmx3L24XdP8TId7z';
const fakePassword = 'fake';

const SIGNUP_URL = '/user';
const LOGIN_URL = '/user';
const DELETE_USER_URL = '/user';

describe('User', () => {
  before((done) => {
    hapiTest({ server })
      .delete(`${DELETE_USER_URL}?username=${username}&password=${password}`, {
        password,
        username,
      })
      .end((result) => {
        if (result.statusCode === 200 || result.statusCode === 404) {
          done();
        }
      })
  });

  describe('/POST signup', () => {
    it('Should create new user', (done) => {
      hapiTest({ server })
        .post(SIGNUP_URL, JSON.stringify({
          password,
          username,
        }))
        .assert(201, done);
    });

    it('Should not create when username already exists', (done) => {
      hapiTest({ server })
        .post(SIGNUP_URL, JSON.stringify({
          password,
          username,
        }))
        .assert(409, done);
    });
  });

  describe('/GET login', () => {
    it('Should accept correct username and password', (done) => {
      hapiTest({ server })
        .get(`${LOGIN_URL}?username=${username}&password=${password}`)
        .assert(200, done);
    });

    it('Should not accept incorrect username and password', (done) => {
      hapiTest({ server })
        .get(`${LOGIN_URL}?username=${username}&password=${fakePassword}`)
        .assert(403, done);
    });

    it('Should not find nonexistent user', (done) => {
      hapiTest({ server })
        .get(`${LOGIN_URL}?username=${fakeUsername}&password=${fakePassword}`)
        .assert(404, done);
    });
  });

  describe('/DELETE delete user', () => {
    it('Should not accept incorrect username and password', (done) => {
      hapiTest({ server })
        .delete(`${DELETE_USER_URL}?username=${fakeUsername}&password=${fakePassword}`)
        .assert(404, done);
    });

    it('Should accept correct username and password', (done) => {
      hapiTest({ server })
        .delete(`${DELETE_USER_URL}?username=${username}&password=${password}`)
        .assert(200, done);
    });

    it('Should not find nonexistent user', (done) => {
      hapiTest({ server })
        .delete(`${DELETE_USER_URL}?username=${fakeUsername}&password=${fakePassword}`)
        .assert(404, done);
    });
  });
});
