import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import setupApp from '../../../src/app';
import Serie from '../../../src/components/serie/serie.model';

import deepMerge from '../../../src/utils/deepMerge';

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

  let defaultSerie = {};
  let defaultEpisode = {};
  let expectedSerie = {};

  describe('POST /series', () => {
    defaultSerie = {
      title: 'Brooklyn 99',
      categories: [],
      seasons: []
    };

    expectedSerie = {
      ...defaultSerie,
      _id: '',
      __v: 0
    };

    it('should return the created object', done => {
      request
        .post(BASE_URL)
        .send(defaultSerie)
        .end((err, res) => {
          defaultIds.serie = res.body._id;
          defaultIds.nonexistent = defaultIds.serie
            .split('')
            .reverse()
            .join('');
          expectedSerie._id = defaultIds.serie;

          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedSerie);

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

  describe('POST /series/:serie', () => {
    it('should return the created object', done => {
      expectedSerie.seasons = [
        {
          _id: '',
          episodes: []
        }
      ];

      request.post(`${BASE_URL}/${defaultIds.serie}`).end((err, res) => {
        defaultIds.season = res.body.seasons[0]._id;
        expectedSerie.seasons[0]._id = defaultIds.season;

        expect(res).to.have.status(201);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.be.eql(expectedSerie);

        done(err);
      });
    });

    it('should return 404 when serie doesnt exists', done => {
      request.post(`${BASE_URL}/${defaultIds.nonexistent}`).end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal('Serie Not Found.');
        done(err);
      });
    });
  });

  describe('POST /series/:serie/:season', () => {
    it('should return serie with new episode', done => {
      defaultEpisode = {
        title: 'Pilot',
        description:
          '"Pilot" is the first episode of the first season of the American television police sitcom series Brooklyn Nine-Nine.',
        filePath: '~/series/brookly-99/season1/pilot.mp4',
        posters: ['~/series/brookly-99/season1/pilot.png'],
        duration: 1000,
        languages: ['en-US'],
        subtitles: [
          {
            language: 'pt-BR',
            filePath: '~/series/brookly-99/season1/pilot.pt-br.srt'
          }
        ]
      };

      expectedSerie.seasons[0].episodes = [{ ...defaultEpisode }];

      request
        .post(`${BASE_URL}/${defaultIds.serie}/${defaultIds.season}`)
        .send(defaultEpisode)
        .end((err, res) => {
          defaultIds.episode = res.body.seasons[0].episodes[0]._id;
          expectedSerie.seasons[0].episodes[0]._id = defaultIds.episode;
          expectedSerie.seasons[0].episodes[0].subtitles[0]._id =
            res.body.seasons[0].episodes[0].subtitles[0]._id;

          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedSerie);

          done(err);
        });
    });

    it('should return 404 when season doesnt exists', done => {
      request
        .post(`${BASE_URL}/${defaultIds.serie}/${defaultIds.nonexistent}`)
        .send(defaultEpisode)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return 404 when serie doesnt exists', done => {
      request
        .post(`${BASE_URL}/${defaultIds.nonexistent}/${defaultIds.season}`)
        .send(defaultEpisode)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return 400 if body is invalid', done => {
      request
        .post(`${BASE_URL}/${defaultIds.serie}/${defaultIds.season}`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          done(err);
        });
    });
  });

  describe('GET /series', () => {
    it('should return all series existents', done => {
      request.get(BASE_URL).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Array');
        expect(res.body).to.be.eql([expectedSerie]);
        done(err);
      });
    });
  });

  describe('GET /series/:serie', () => {
    it('should return serie if exists', done => {
      request.get(`${BASE_URL}/${defaultIds.serie}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.be.eql(expectedSerie);
        done(err);
      });
    });

    it('should return 404 if doesnt exists', done => {
      request.get(`${BASE_URL}/${defaultIds.nonexistent}`).end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
    });
  });

  describe('GET /series/:serie/:season', () => {
    it('should return season if exists', done => {
      request
        .get(`${BASE_URL}/${defaultIds.serie}/${defaultIds.season}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.be.eql(expectedSerie.seasons[0]);
          done(err);
        });
    });

    it('should return 404 if serie doesnt exists', done => {
      request
        .get(`${BASE_URL}/${defaultIds.nonexistent}/${defaultIds.season}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return 404 if season doesnt exists', done => {
      request
        .get(`${BASE_URL}/${defaultIds.serie}/${defaultIds.nonexistent}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('PUT /series/:serie', () => {
    it('should return the updated object', done => {
      const payload = {
        title: 'Brooklyn Nine-Nine'
      };

      expectedSerie = Object.assign({}, expectedSerie, payload);

      request
        .put(`${BASE_URL}/${defaultIds.serie}`)
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.eql(expectedSerie);
          done(err);
        });
    });

    it('should return 404 when serie doesnt exists', done => {
      request
        .put(`${BASE_URL}/${defaultIds.nonexistent}`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('PUT /series/:serie/:season/:episode', () => {
    it('should return the updated object', done => {
      const payload = {
        languages: ['pt-BR'],
        subtitles: [
          {
            language: 'en-US',
            filePath: '~/series/brookly-99/season1/pilot.en-us.srt'
          }
        ]
      };

      const expectedResult = deepMerge(
        expectedSerie.seasons[0].episodes[0],
        payload
      );

      request
        .put(
          `${BASE_URL}/${defaultIds.serie}/${defaultIds.season}/${defaultIds.episode}`
        )
        .send(payload)
        .end((err, res) => {
          expectedResult.subtitles = expectedResult.subtitles.map(el => {
            el._id = res.body.subtitles.filter(
              sub => sub.language === el.language
            )[0]._id;
            return el;
          });

          expect(res).to.have.status(200);
          expect(res.body).to.be.eql(expectedResult);
          done(err);
        });
    });

    it('should return 404 when serie doesnt exists', done => {
      request
        .put(`${BASE_URL}/${defaultIds.nonexistent}`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('DELETE /series/:serie/:season/:episode', () => {
    it('should return successful message when delete', done => {
      request
        .del(
          `${BASE_URL}/${defaultIds.serie}/${defaultIds.season}/${defaultIds.episode}`
        )
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.equal('Episode deleted successfully!');
          done(err);
        });
    });

    it('should return 404 when season doesnt exists', done => {
      request
        .del(
          `${BASE_URL}/${defaultIds.serie}/${defaultIds.nonexistent}/${defaultIds.episode}`
        )
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return 404 when serie doesnt exists', done => {
      request
        .del(
          `${BASE_URL}/${defaultIds.nonexistent}/${defaultIds.season}/${defaultIds.episode}`
        )
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('DELETE /series/:serie/:season', () => {
    it('should return successful message when delete', done => {
      request
        .del(`${BASE_URL}/${defaultIds.serie}/${defaultIds.season}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.equal('Season deleted successfully!');
          done(err);
        });
    });

    it('should return 404 when season doesnt exists', done => {
      request
        .del(`${BASE_URL}/${defaultIds.serie}/${defaultIds.nonexistent}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });

    it('should return 404 when serie doesnt exists', done => {
      request
        .del(`${BASE_URL}/${defaultIds.nonexistent}/${defaultIds.season}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done(err);
        });
    });
  });

  describe('DELETE /series/:serie', () => {
    it('should return successful message when delete', done => {
      request.del(`${BASE_URL}/${defaultIds.serie}`).end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal('Serie deleted successfully!');
        done(err);
      });
    });

    it('should return 404 when serie doesnt exists', done => {
      request.del(`${BASE_URL}/${defaultIds.nonexistent}`).end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
    });
  });
});
