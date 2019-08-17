import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import setupApp from '../../../src/app';

import User from '../../../src/components/user/user.model';

chai.use(chaiHttp);

describe('User: Routes', () => {
  const BASE_URL = '/users';

  let server;
  let request;

  before(function(done) {
    this.timeout(10000);

    setupApp()
      .then(app => {
        server = app;
      })
      .then(() => User.remove({}))
      .then(() => done());
  });

  beforeEach(() => {
    request = chai.request(server);
  });

  const defaultId = '56cb91bdc3464f14678934ba';
  const defaultEmail = 'lucas.barbosa@gmail.com';
  const defaultUser = {
    preferedLanguage: 'pt',
    useSubtitle: false,
    role: 'user',
    name: 'Barbosa',
    email: defaultEmail,
    password: 'teste123'
  };
  const expectedUser = {
    preferedLanguage: 'pt',
    useSubtitle: false,
    role: 'user',
    name: 'Barbosa',
    email: defaultEmail,
    _id: defaultId,
    __v: 0
  };

  describe('POST /users', () => {
    it('should return a created user', done => {
      request
        .post(BASE_URL)
        .send(defaultUser)
        .end((err, res) => {
          res.body._id = defaultId;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.be.eql(expectedUser);
          done(err);
        });
    });

    it('should return 400 when email is already in use', done => {
      request
        .post(BASE_URL)
        .send(defaultUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.be.equal('This email is already taken.');
          done(err);
        });
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', done => {
      request.get(BASE_URL).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done(err);
      });
    });
  });

  describe('GET /users/:email', () => {
    it('should retun an user if exists', done => {
      request.get(`${BASE_URL}/${defaultEmail}`).end((err, res) => {
        res.body._id = defaultId;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.eql(expectedUser);
        done(err);
      });
    });

    it('should return 404 if an user doesnt exists', done => {
      request.get(`${BASE_URL}/unexistentuser@gmail.com`).end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
    });
  });

  describe('PUT /users/:email', () => {
    const payload = {
      name: 'Débora',
      password: 'teste123'
    };

    it('should return 401 if password is incorrect', done => {
      payload.password = 'senhaErrada';

      request
        .put(`${BASE_URL}/${defaultEmail}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });

    it('should return a updated user', done => {
      const expectedResult = Object.assign({}, expectedUser, {
        name: 'Débora'
      });

      payload.password = 'teste123';

      request
        .put(`${BASE_URL}/${defaultEmail}`)
        .send(payload)
        .end((err, res) => {
          res.body._id = defaultId;
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.be.eql(expectedResult);
          done(err);
        });
    });
  });

  describe('DELETE /users/:email', done => {
    it('should return 400 when user doesnt exists', () => {
      request.del(`${BASE_URL}/unexistentemail@gmail.com`, done => {
        expect(res).to.have.status(400);
        done(err);
      });
    });

    it('should return 401 when password is incorrect', done => {
      const payload = {
        password: 'senhaErrada'
      };

      request
        .del(`${BASE_URL}/${defaultEmail}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done(err);
        });
    });

    it('should return 200 when delete user', done => {
      const payload = {
        password: 'teste123'
      };

      const expectedResult = {
        message: 'User deleted successfully!'
      };

      request
        .del(`${BASE_URL}/${defaultEmail}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedResult);
          done(err);
        });
    });
  });
});
