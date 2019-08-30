import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import setupApp from '../../../src/app';

import Movie from '../../../src/components/movie/movie.model';

chai.use(chaiHttp);

describe('Movies: Router', () => {
  const BASE_URL = '/movies';

  let server;
  let request;

  before(function(done) {
    this.timeout(10000);

    setupApp()
      .then(app => {
        server = app;
      })
      .then(() => Movie.deleteMany({}))
      .then(() => done());
  });

  beforeEach(() => {
    request = chai.request(server);
  });

  let defaultId = '';
  const inexistentId = '56cb91bdc3464f14678934ba';
  const defaultMovie = {
    title: 'Percy Jackson',
    categories: [],
    saga: []
  };
  const expectedMovie = {
    ...defaultMovie,
    _id: defaultId,
    __v: 0
  };

  describe('POST /movies', () => {
    it('should return the created object', done => {
      request
        .post(BASE_URL)
        .send(defaultMovie)
        .end((err, res) => {
          defaultId = res.body._id;
          expectedMovie._id = defaultId;

          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedMovie);

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

  let defaultSagaId = '';
  const defaultSaga = {
    title: 'Percy Jackson e o Ladrão de Raios',
    description:
      'É um filme de aventura e fantasia dirigido por Chris Columbus e produzido pela 20th Century Fox, tendo sua estreia ocorrida em 12 de fevereiro de 2010 nos Estados Unidos. O filme é baseado em The Lightning Thief - primeiro livro da série Percy Jackson & the Olympians, escrita por Rick Riordan - e é o primeiro filme da série de filmes baseada na série literária.',
    filePath: '~/movies/percy-jackson/percyjackson-eo-ladrao-de-raios.mp4',
    duration: 7080,
    posters: ['~/movies/percy-jackson/percyjackson-eo-ladrao-de-raios.png'],
    languages: ['pt-BR'],
    subtitles: []
  };
  const expectedSaga = {
    ...defaultSaga
  };

  describe('POST /movies/:id', () => {
    it('should return the created object', done => {
      request
        .post(`${BASE_URL}/${defaultId}`)
        .send(defaultSaga)
        .end((err, res) => {
          defaultSagaId = res.body.saga[0]._id;
          expectedSaga._id = defaultSagaId;
          expectedMovie.saga.push(expectedSaga);

          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedMovie);
          done(err);
        });
    });

    it('should return 400 if body is invalid', done => {
      request
        .post(`${BASE_URL}/${defaultId}`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });
  });

  describe('GET /movies', () => {
    it('should return all movies', done => {
      request.get(BASE_URL).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        expect(res.body).to.be.eql([expectedMovie]);
        done(err);
      });
    });
  });

  describe('GET /movies/:id', () => {
    it('should return selected movie', done => {
      request.get(`${BASE_URL}/${defaultId}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.be.eql(expectedMovie);
        done(err);
      });
    });

    it('should return 404 if movie doesnt exists', done => {
      request.get(`${BASE_URL}/${inexistentId}`).end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal('Movie Not Found.');
        done(err);
      });
    });
  });

  describe('GET /movies/:id/:movie', () => {
    it('should return selected movie from saga', done => {
      request
        .get(`${BASE_URL}/${defaultId}/${defaultSagaId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedSaga);
          done(err);
        });
    });

    it('should return 404 if movie doesnt exists', done => {
      request
        .get(`${BASE_URL}/${defaultId}/${inexistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Movie Not Found.');
          done(err);
        });
    });
  });

  describe('PUT /movies/:id', () => {
    const categories = ['56ab91bdc3464f14678934ba'];
    const payload = { categories };

    it('should return updated movie', done => {
      request
        .put(`${BASE_URL}/${defaultId}`)
        .send(payload)
        .end((err, res) => {
          expectedMovie.categories.push(...categories);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedMovie);
          done(err);
        });
    });

    it('should return 404 when movie doesnt exists', done => {
      request
        .put(`${BASE_URL}/${inexistentId}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Movie Not Found.');
          done(err);
        });
    });
  });

  describe('PUT /movies/:id/:movie', () => {
    const payload = {
      subtitles: [
        {
          language: 'pt-BR',
          filePath: '~/movies/percy-jackson/percyjackson-eo-ladrao-de-raios.srt'
        }
      ]
    };

    it('should return updated movie', done => {
      request
        .put(`${BASE_URL}/${defaultId}/${defaultSagaId}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');

          payload.subtitles[0]._id = res.body.subtitles[0]._id;
          expectedMovie.saga[0].subtitles = payload.subtitles;

          expect(res.body).to.be.eql(expectedMovie.saga[0]);
          done(err);
        });
    });

    it('should return 404 when movie doesnt exists', done => {
      request
        .put(`${BASE_URL}/${defaultId}/${inexistentId}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Movie Not Found.');
          done(err);
        });
    });
  });

  describe('DELETE /movies/:id/:movie', () => {
    it('should return successful message when delete', done => {
      request
        .del(`${BASE_URL}/${defaultId}/${defaultSagaId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.equal('Movie deleted successfully!');
          done(err);
        });
    });

    it('should return 404 when movie doesnt exists', done => {
      request
        .del(`${BASE_URL}/${defaultId}/${inexistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Movie Not Found.');
          done(err);
        });
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should return successful message when delete', done => {
      request.del(`${BASE_URL}/${defaultId}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal('Movie deleted successfully!');
        done(err);
      });
    });

    it('should return 404 when movie doesnt exists', done => {
      request.del(`${BASE_URL}/${inexistentId}`).end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal('Movie Not Found.');
        done(err);
      });
    });
  });
});
