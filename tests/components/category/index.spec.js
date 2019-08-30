import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import setupApp from '../../../src/app';

import Category from '../../../src/components/user/user.model';

chai.use(chaiHttp);

describe('Category: Routes', () => {
  const BASE_URL = '/categories';

  let server;
  let request;

  before(function(done) {
    this.timeout(10000);

    setupApp()
      .then(app => {
        server = app;
      })
      .then(() => Category.deleteMany({}))
      .then(() => done());
  });

  beforeEach(() => {
    request = chai.request(server);
  });

  let defaultId = '56cb91bdc3464f14678934ba';
  const defaultCategory = {
    name: 'Ação'
  };
  const expectedCategory = {
    ...defaultCategory,
    _id: defaultId,
    __v: 0
  };

  describe('POST /categories', () => {
    it('should return a created category', done => {
      request
        .post(BASE_URL)
        .send(defaultCategory)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');

          defaultId = res.body._id;
          expectedCategory._id = defaultId;

          expect(res.body).to.be.eql(expectedCategory);
          done(err);
        });
    });

    it('should return 400 if body is invalid', done => {
      request
        .post(BASE_URL)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });
  });

  describe('GET /categories', () => {
    it('should return a list of categories', done => {
      request.get(BASE_URL).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done(err);
      });
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a category if exists', done => {
      request.get(`${BASE_URL}/${defaultId}`).end((err, res) => {
        res.body._id = defaultId;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.be.eql(expectedCategory);
        done(err);
      });
    });

    it('should return 404 if an category doesnt exists', done => {
      request.get(`${BASE_URL}/unexistendId`).end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
    });
  });

  describe('PUT /categories/:id', () => {
    it('should return a updated category', done => {
      const payload = { name: 'Comédia' };
      const expectedResult = Object.assign({}, expectedCategory, payload);

      request
        .put(`${BASE_URL}/${defaultId}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.be.eql(expectedResult);
          done(err);
        });
    });
  });

  describe('DELETE /categories/:id', () => {
    const expectedResult = {
      message: 'Category deleted successfully!'
    };

    it('should return a successfuly message when delete', done => {
      request.del(`${BASE_URL}/${defaultId}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('Object');
        expect(res.body).to.be.eql(expectedResult);
        done(err);
      });
    });
  });
});
