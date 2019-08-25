import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Movie from '../../../src/components/movie/movie.model';
import MovieController from '../../../src/components/movie/movie.controller';

import ApiError from '../../../src/helpers/ApiError';

chai.use(sinonChai);

describe('Movie: Controller', () => {
  // Express Params
  const req = {
    body: {
      title: 'Harry Potter',
      categories: []
    },
    params: {
      id: 'asda6as89dc2we2f',
      movie: 0
    }
  };

  const res = {};
  let next;

  // Errors
  const error = new Error({ error: 'Error Message' });
  const notFoundError = new ApiError(404, 'Movie');

  let expectedResult;

  beforeEach(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
    next = sinon.spy();
  });

  describe('create() movie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'create').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.body', () => {
      return MovieController.create(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.body);
      });
    });

    it('should return the created object', () => {
      expectedResult = { ...req.body };
      return MovieController.create(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when the object is created', () => {
      return MovieController.create(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub = modelStub.rejects(error);
      return MovieController.create(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('append() movie', () => {
    const req2 = {
      body: {},
      params: {
        id: '456a84565s2pks1'
      }
    };

    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'findByIdAndUpdate').resolves(req2.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call modelStub with req.params.id', () => {
      return MovieController.append(req2, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req2.params.id);
      });
    });

    it('should call modelStub with req.body', () => {
      return MovieController.append(req2, res, next).then(() => {
        const payload = {
          $push: { saga: req2.body }
        };

        expect(modelStub).to.have.been.calledWith(req2.params.id, payload);
      });
    });

    it('should return the object', () => {
      expectedResult = { ...req2.body };
      return MovieController.append(req2, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 201 when object is appendedd', () => {
      return MovieController.append(req2, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.append(req2, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('index() [] movies', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'find').resolves();
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with {}', () => {
      return MovieController.index(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({});
      });
    });

    it('should return a list of movies', () => {
      expectedResult = [{}, {}];
      modelStub.resolves(expectedResult);

      return MovieController.index(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 when no error', () => {
      return MovieController.index(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.index(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('get() movie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'findById').resolves();
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return MovieController.get(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should return a movie', () => {
      expectedResult = {};
      modelStub.resolves(expectedResult);

      return MovieController.get(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 when no error', () => {
      return MovieController.get(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.get(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('getFromSaga() movie', () => {
    let modelStub;

    beforeEach(() => {
      expectedResult = {
        title: 'Harry Potter',
        categories: [],
        saga: [
          {
            title: 'Harry Potter ea Pedra Filosofal',
            description: 'First movie of Harry Potter'
          }
        ]
      };

      modelStub = sinon.stub(Movie, 'findOne').resolves(expectedResult);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return MovieController.getFromSaga(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'saga._id': req.params.movie
        });
      });
    });

    it('should return a movie', () => {
      return MovieController.getFromSaga(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.saga[req.params.movie]
        );
      });
    });

    it('should return 200 when no error', () => {
      return MovieController.getFromSaga(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.getFromSaga(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('update() movie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'findByIdAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return MovieController.update(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should call model with req.body', () => {
      return MovieController.update(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id, req.body, {
          new: true
        });
      });
    });

    it('should return updated object', () => {
      expectedResult = { ...req.body };
      return MovieController.update(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 200 status', () => {
      return MovieController.update(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.update(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('updateOnSaga() movie', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'findOneAndUpdate').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return MovieController.updateOnSaga(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'saga._id': req.params.movie
        });
      });
    });

    it('should call model with req.body', () => {
      return MovieController.updateOnSaga(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(
          { _id: req.params.id, 'saga._id': req.params.movie },
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
        saga: [
          {
            title: 'Harry Potter ea Pedra Filosofal',
            description: 'First movie of Harry Potter'
          }
        ]
      };

      modelStub.resolves(expectedResult);

      return MovieController.updateOnSaga(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(
          expectedResult.saga[req.params.movie]
        );
      });
    });

    it('should return 200 status', () => {
      return MovieController.updateOnSaga(req, res, next).then(() => {
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.updateOnSaga(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroy()', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'findByIdAndRemove').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return MovieController.destroy(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith(req.params.id);
      });
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Movie deleted successfully!'
      };

      return MovieController.destroy(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next with not found error when movie doesnt exists', () => {
      modelStub.resolves();
      return MovieController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const expectedError = next.firstCall.args[0];

        expect(expectedError).to.be.an.instanceOf(ApiError);
        expect(expectedError.code).to.be.equal(notFoundError.code);
        expect(expectedError.message).to.be.equal(notFoundError.message);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroyOnSaga()', () => {
    let modelStub;

    beforeEach(() => {
      modelStub = sinon.stub(Movie, 'findOneAndRemove').resolves(req.body);
    });

    afterEach(() => {
      modelStub.restore();
    });

    it('should call model with req.params.id', () => {
      return MovieController.destroyOnSaga(req, res, next).then(() => {
        expect(modelStub).to.have.been.calledWith({
          _id: req.params.id,
          'saga._id': req.params.movie
        });
      });
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Movie deleted successfully!'
      };

      return MovieController.destroyOnSaga(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next with not found error when movie doesnt exists', () => {
      modelStub.resolves();
      return MovieController.destroyOnSaga(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const expectedError = next.firstCall.args[0];

        expect(expectedError).to.be.an.instanceOf(ApiError);
        expect(expectedError.code).to.be.equal(notFoundError.code);
        expect(expectedError.message).to.be.equal(notFoundError.message);
      });
    });

    it('should call next with error when an error occurs', () => {
      modelStub.rejects(error);
      return MovieController.destroyOnSaga(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });
});
