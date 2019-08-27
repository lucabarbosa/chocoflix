import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import setupApp from '../../../src/app';
import Serie from '../../../src/components/serie/serie.model';

chai.use(chaiHttp);

describe('Serie: Router', () => {
  const BASE_URL = '/series';

  let server;
  let request;

  before(function(done) {
    this.timeout(10000); // Change chai timeout for dont break test

    setupApp()
      .then(app => {
        server = app;
      })
      .then(() => Serie.deleteMany({}))
      .then(() => done());
  });

  beforeEach(() => {
    request = chai.request(server);
  });

  const defaultIds = {
    nonexistent: '',
    serie: '',
    season: '',
    episode: ''
  };

  describe('POST /series', () => {
    const defaultSerie = {};
    const expectedSerie = {};

    it('should return the created object', done => {
      request
        .post(BASE_URL)
        .send(defaultSerie)
        .end((err, res) => {
          defaultIds.serie = res.body._id;
          expectedSerie._id = defaultIds.serie;

          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedSerie);

          done(err);
        });
    });
  });
});
