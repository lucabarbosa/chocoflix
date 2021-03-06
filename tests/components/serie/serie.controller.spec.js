import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Serie from '../../../src/components/serie/serie.model';
import SerieController from '../../../src/components/serie/serie.controller';

import getPartialSubdocumentUpdatePayload from '../../../src/utils/getPartialSubdocumentUpdatePayload';
import ApiError from '../../../src/helpers/ApiError';

chai.use(sinonChai);

describe('Serie: Controller', () => {
  // Express Params
  const req = {
    body: {
      title: 'Brooklyn 99',
      categories: []
    },
    params: {
      serie: 'asda6as89dc2we2f',
      season: 'asda6as89dc2we2f',
      episode: 'asda6as89dc2we2f'
    }
  };

  const res = {};
  let next;

  // Errors
  const error = new Error({ error: 'Error Message' });
  const notFoundError = new ApiError(404, 'Serie');

  let expectedResult;

  beforeEach(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
    next = sinon.spy();
  });

  describe('create() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'create').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.body', () => {
      return SerieController.create(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.body);
      });
    });

    it('should return the created object', () => {
      expectedResult = { ...req.body };
      return SerieController.create(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when the object is created', () => {
      return SerieController.create(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub = modelStub.rejects(error);
      return SerieController.create(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('appendSeason() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findByIdAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call modelStub with req.params.serie', () => {
      return SerieController.appendSeason(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.serie);
      });
    });

    it('should create a new season', () => {
      return SerieController.appendSeason(req, res, next).then(() => {
        const payload = {
          $push: { seasons: { episodes: [] } }
        };

        expect(modelStub).to.have.been.calledWith(req.params.serie, payload);
      });
    });

    it('should return the object', () => {
      expectedResult = { ...req.body };
      return SerieController.appendSeason(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when object is appended', () => {
      return SerieController.appendSeason(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.appendSeason(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('appendEpisode() serie', () => {
    const req2 = {
      body: {},
      params: {
        serie: 'asdjaslkdmakll',
        season: 0
      }
    };

    const mockSerie = {
      title: 'Brookly Nine-Nine',
      seasons: {
        data: [
          {
            episodes: [{}]
          }
        ],
        id: function() {
          return this.data[0];
        }
      }
    };

    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndUpdate').resolves(mockSerie);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call modelStub with req.params.serie', () => {
      return SerieController.appendEpisode(req2, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req2.params.serie,
          'seasons._id': req2.params.season
        });
      });
    });

    it('should call modelStub with req.body', () => {
      return SerieController.appendEpisode(req2, res, next).then(() => {
        const payload = {
          $push: { 'seasons.$.episodes': req2.body }
        };

        expect(modelStub).to.have.been.calledWith(
          {
            _id: req2.params.serie,
            'seasons._id': req2.params.season
          },
          payload
        );
      });
    });

    it('should return the object', () => {
      expectedResult = { ...mockSerie };
      return SerieController.appendEpisode(req2, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when object is appendedd', () => {
      return SerieController.appendEpisode(req2, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.appendEpisode(req2, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('index() [] series', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'find').resolves();
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with {}', () => {
      return SerieController.index(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({});
      });
    });

    it('should return a list of series', () => {
      expectedResult = [[{}, {}], [{}]];
      modelStub.resolves(expectedResult);

      return SerieController.index(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.index(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.index(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('get() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findById').resolves({});
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.get(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.serie);
      });
    });

    it('should return a serie', () => {
      expectedResult = {};
      modelStub.resolves(expectedResult);

      return SerieController.get(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.get(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.get(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('getSeason() season', () => {
    let modelStub;

    beforeEach(() => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: {
          data: [
            {
              episodes: [{}, {}]
            }
          ],
          id: function(season) {
            return this.data[0];
          }
        }
      };

      modelStub = sinon.stub(Serie, 'findOne').resolves(expectedResult);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.getSeason(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.serie,
          'seasons._id': req.params.season
        });
      });
    });

    it('should return a serie', () => {
      return SerieController.getSeason(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons.data[0]
        );
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.getSeason(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.getSeason(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('getEpisode() season', () => {
    let modelStub;

    beforeEach(() => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: {
          data: [
            {
              episodes: {
                data: [
                  {
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
                  }
                ],
                id: function(episode) {
                  return this.data[0];
                }
              }
            }
          ],
          id: function(season) {
            return this.data[0];
          }
        }
      };

      modelStub = sinon.stub(Serie, 'findOne').resolves(expectedResult);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.episode', () => {
      return SerieController.getEpisode(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.serie,
          'seasons._id': req.params.season,
          'seasons.episodes._id': req.params.episode
        });
      });
    });

    it('should return an episode', () => {
      return SerieController.getEpisode(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons.data[0].episodes.data[0]
        );
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.getEpisode(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.getEpisode(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('update() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findByIdAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.update(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.serie);
      });
    });

    it('should call model with req.body', () => {
      return SerieController.update(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.serie, req.body, {
          new: true
        });
      });
    });

    it('should return updated object', () => {
      expectedResult = { ...req.body };
      return SerieController.update(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 status', () => {
      return SerieController.update(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.update(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('updateSeason() serie', () => {
    let modelStub;

    beforeEach(() => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: {
          data: [{ episodes: [{}, {}] }],
          id: function(season) {
            return this.data[0];
          }
        }
      };

      modelStub = sinon
        .stub(Serie, 'findOneAndUpdate')
        .resolves(expectedResult);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.updateSeason(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.serie,
          'seasons._id': req.params.season
        });
      });
    });

    it('should call model with req.body', () => {
      const payload = getPartialSubdocumentUpdatePayload('seasons', req.body);

      return SerieController.updateSeason(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(
          { _id: req.params.serie, 'seasons._id': req.params.season },
          payload,
          { new: true }
        );
      });
    });

    it('should return updated object', () => {
      return SerieController.updateSeason(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons.data[0]
        );
      });
    });

    it('should return 200 status', () => {
      return SerieController.updateSeason(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.updateSeason(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('updateEpisode() serie', () => {
    let modelStub;

    beforeEach(() => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: {
          data: [
            {
              episodes: {
                data: [{}, {}],
                id: function(episode) {
                  return this.data[0];
                }
              }
            }
          ],
          id: function(season) {
            return this.data[0];
          }
        }
      };

      modelStub = sinon
        .stub(Serie, 'findOneAndUpdate')
        .resolves(expectedResult);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.updateEpisode(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.serie,
          'seasons._id': req.params.season,
          'seasons.episodes._id': req.params.episode
        });
      });
    });

    it('should call model with req.body', () => {
      const payload = getPartialSubdocumentUpdatePayload(
        'seasons.$[season].episodes',
        req.body
      );

      return SerieController.updateEpisode(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(
          {
            _id: req.params.serie,
            'seasons._id': req.params.season,
            'seasons.episodes._id': req.params.episode
          },
          payload,
          {
            arrayFilters: [{ 'season._id': req.params.season }],
            new: true
          }
        );
      });
    });

    it('should return updated object', () => {
      return SerieController.updateEpisode(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons.data[0].episodes.data[0]
        );
      });
    });

    it('should return 200 status', () => {
      return SerieController.updateEpisode(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.updateEpisode(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroy()', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findByIdAndRemove').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.destroy(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.serie);
      });
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Serie deleted successfully!'
      };

      return SerieController.destroy(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next with 404 if serie doesnt exists', () => {
      modelStub.resolves();

      return SerieController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(notFoundError.code);
        expect(calledError.message).to.be.equal('Serie Not Found.');
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroySeason()', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndUpdate').resolves();
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      return SerieController.destroySeason(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(
          { _id: req.params.serie, 'seasons._id': req.params.season },
          { $pull: { seasons: { _id: req.params.season } } },
          { new: true }
        );
      });
    });

    it('should return successful deletion message', () => {
      const serie = {
        seasons: {
          id() {
            return false;
          }
        }
      };

      modelStub.resolves(serie);

      expectedResult = {
        message: 'Season deleted successfully!'
      };

      return SerieController.destroySeason(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next with 404 if season doesnt exists', () => {
      modelStub.resolves();

      return SerieController.destroySeason(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(notFoundError.code);
        expect(calledError.message).to.be.equal('Season Not Found.');
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.destroySeason(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroyEpisode()', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.serie', () => {
      modelStub.rejects();

      return SerieController.destroyEpisode(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(
          {
            _id: req.params.serie,
            'seasons._id': req.params.season
          },
          { $pull: { 'seasons.$.episodes': { _id: req.params.episode } } },
          { new: true }
        );
      });
    });

    it('should return successful deletion message', () => {
      const serie = {
        seasons: {
          data: {
            episodes: {
              data: {},
              id: function(episode) {
                return null;
              }
            }
          },
          id: function(season) {
            return this.data;
          }
        }
      };

      modelStub.resolves(serie);

      expectedResult = {
        message: 'Episode deleted successfully!'
      };

      return SerieController.destroyEpisode(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 404 if episode doesnt exists', () => {
      modelStub.resolves();

      return SerieController.destroyEpisode(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(notFoundError.code);
        expect(calledError.message).to.be.equal('Episode Not Found.');
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.destroyEpisode(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });
});
