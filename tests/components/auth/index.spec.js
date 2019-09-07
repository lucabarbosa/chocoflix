import chai, { expect } from 'chai';

import chaiHttp from 'chai-http';

import setupApp from '../../../src/app';

chai.use(chaiHttp);

describe('Auth: Routes', () => {
  const BASE_URL = '/auth';

  let server, request;

  before(function(done) {
    this.timeout(10000);

    setupApp().then(app => {
      server = app;
      done();
    });
  });

  beforeEach(() => {
    request = chai.request(server);
  });

  describe('POST /auth/login', () => {
    const defaultEmail = 'lucas.barbosa@gmail.com';
    const defaultPassword = 'teste123';

    before(done => {
      const defaultUser = {
        preferedLanguage: 'pt',
        useSubtitle: false,
        role: 'user',
        name: 'Barbosa',
        email: defaultEmail,
        password: defaultPassword
      };

      chai
        .request(server)
        .post('/users')
        .send(defaultUser)
        .end((err, res) => {
          done(err);
        });
    });

    it('should return 400 when req.body is invalid', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });

    it('should return 404 when email doesnt exists', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({ email: 'teste@gmail.com', password: 'teste ' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return 401 when password is incorrect', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({ email: defaultEmail, password: 'teste' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });

    it('should return token when all is correct', done => {
      request
        .post(`${BASE_URL}/login`)
        .send({ email: defaultEmail, password: defaultPassword })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done(err);
        });
    });
  });
});
