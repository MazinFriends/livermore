/* eslint-disable */

process.env.MONGO_HOSTNAME = 'localhost';
process.env.MONGO_PORT = 27017;
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const User = require('../src/db/user_model');

const should = chai.should();

const testUsername = 'asdfousadifuasdofias7dif7a7sdofasdfasdf';
const testPassword = 'asdf3257234v;@#$234234234234';


chai.use(chaiHttp);

describe('Users', () => {
  beforeEach(async (done) => {
    const ZERO = 0;
    try {
      const userArr = await User.find({
        username: testUsername,
      });
      return userArr;
    } catch (error) {
      console.log(error);
    }
  });

  describe('/GET login', () => {
      it('Should return no user', (done) => {
        const query = '?username=asdfaskjdhflasdjhf&password=123421423535235';
        chai.request(server)
            .get(`/login${query}`)
            .end((err, res) => {
              res.should.have.status(403);
              done();
            });
      });
  });
});
