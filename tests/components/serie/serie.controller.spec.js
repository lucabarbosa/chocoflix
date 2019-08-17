import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Serie from '../../../src/components/serie/serie.model';
import SerieController from '../../../src/components/serie/serie.controller';
import { it } from 'mocha';

chai.use(sinonChai);

describe('Serie: Controller', () => {
  const req = {
    body: {
      title: 'Brooklyn 99',
      categories: []
    },
    params: {
      id: 'asda6as89dc2we2f',
      season: 0,
      episode: 0
    }
  };

  const res = {};
  const error = new Error({ error: 'Error Message' });
  let expectedResult;

  beforeEach(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
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
      return SerieController.create(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(req.body);
      });
    });

    it('should return the created object', () => {
      expectedResult = { ...req.body };
      return SerieController.create(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when the object is created', () => {
      return SerieController.create(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub = modelStub.rejects(error);
      return SerieController.create(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
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

    it('should call modelStub with req.params.id', () => {
      return SerieController.appendSeason(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should create a new season', () => {
      return SerieController.appendSeason(req, res).then(() => {
        const payload = {
          $push: { seasons: { episodes: [] } }
        };

        expect(modelStub).to.have.been.calledWith(req.params.id, payload);
      });
    });

    it('should return the object', () => {
      expectedResult = { ...req.body };
      return SerieController.appendSeason(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when object is appended', () => {
      return SerieController.appendSeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.appendSeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('appendEpisode() serie', () => {
    const req2 = {
      body: {},
      params: {
        id: 'asdjaslkdmakll',
        season: 0
      }
    };

    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndUpdate').resolves(req2.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call modelStub with req.params.id', () => {
      return SerieController.appendEpisode(req2, res).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req2.params.id,
          'seasons._id': req.params.season
        });
      });
    });

    it('should call modelStub with req.body', () => {
      return SerieController.appendEpisode(req2, res).then(() => {
        const payload = {
          $push: { episodes: req2.body }
        };

        expect(modelStub).to.have.been.calledWith(
          {
            _id: req2.params.id,
            'seasons._id': req.params.season
          },
          payload
        );
      });
    });

    it('should return the object', () => {
      expectedResult = { ...req2.body };
      return SerieController.appendEpisode(req2, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when object is appendedd', () => {
      return SerieController.appendEpisode(req2, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.appendEpisode(req2, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
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
      return SerieController.index(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith({});
      });
    });

    it('should return a list of series', () => {
      expectedResult = [[{}, {}], [{}]];
      modelStub.resolves(expectedResult);

      return SerieController.index(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.index(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.index(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('get() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findById').resolves();
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return SerieController.get(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should return a serie', () => {
      expectedResult = {};
      modelStub.resolves(expectedResult);

      return SerieController.get(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.get(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.get(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('getSeason() season', () => {
    let modelStub;

    beforeEach(() => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: [
          {
            episodes: [{}, {}]
          }
        ]
      };

      modelStub = sinon.stub(Serie, 'findOne').resolves(expectedResult);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return SerieController.getSeason(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'seasons._id': req.params.season
        });
      });
    });

    it('should return a serie', () => {
      return SerieController.getSeason(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons[req.params.season]
        );
      });
    });

    it('should return 200 when no error', () => {
      return SerieController.getSeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.getSeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
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

    it('should call model with req.params.id', () => {
      return SerieController.update(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should call model with req.body', () => {
      return SerieController.update(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id, req.body, {
          new: true
        });
      });
    });

    it('should return updated object', () => {
      expectedResult = { ...req.body };
      return SerieController.update(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 status', () => {
      return SerieController.update(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.update(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('updateSeason() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return SerieController.updateSeason(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'seasons._id': req.params.season
        });
      });
    });

    it('should call model with req.body', () => {
      return SerieController.updateSeason(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(
          { _id: req.params.id, 'seasons._id': req.params.season },
          req.body,
          {
            new: true
          }
        );
      });
    });

    it('should return updated object', () => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: [
          {
            episodes: [{}, {}]
          }
        ]
      };

      modelStub.resolves(expectedResult);

      return SerieController.updateSeason(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons[req.params.season]
        );
      });
    });

    it('should return 200 status', () => {
      return SerieController.updateSeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.updateSeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('updateEpisode() serie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return SerieController.updateEpisode(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'seasons._id': req.params.season,
          'seasons.$.episodes._id': req.params.episode
        });
      });
    });

    it('should call model with req.body', () => {
      return SerieController.updateEpisode(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(
          {
            _id: req.params.id,
            'seasons._id': req.params.season,
            'seasons.$.episodes._id': req.params.episode
          },
          req.body,
          {
            new: true
          }
        );
      });
    });

    it('should return updated object', () => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        seasons: [
          {
            episodes: [{}, {}]
          }
        ]
      };

      modelStub.resolves(expectedResult);

      return SerieController.updateEpisode(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.seasons[req.params.season].episodes[req.params.episode]
        );
      });
    });

    it('should return 200 status', () => {
      return SerieController.updateEpisode(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.updateEpisode(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
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

    it('should call model with req.params.id', () => {
      return SerieController.destroy(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Serie deleted successfully!'
      };

      return SerieController.destroy(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 404 if serie doesnt exists', () => {
      modelStub.resolves();
      return SerieController.destroy(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.destroy(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('destroySeason()', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Serie, 'findOneAndRemove').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return SerieController.destroySeason(req, res).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'seasons._id': req.params.season
        });
      });
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Season deleted successfully!'
      };

      return SerieController.destroySeason(req, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 404 if serie doesnt exists', () => {
      modelStub.resolves();
      return SerieController.destroySeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return 400 when an error occurs', () => {
      modelStub.rejects(error);
      return SerieController.destroySeason(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });
});