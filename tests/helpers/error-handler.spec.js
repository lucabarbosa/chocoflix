import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import errorHandler from '../../src/helpers/error-handler';

chai.use(sinonChai);

describe('Error Handler', () => {
  const req = {};
  const res = {};
  const expectedResult = {};

  let error;

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.spy();
  });

  describe('Custom String Error', () => {
    before(() => {
      error = 'error message';
    });

    it('should return status 400', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(400);
    });

    it('should return correct error json', () => {
      expectedResult.message = error;
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith(expectedResult);
    });
  });

  describe('Validation Error', () => {
    before(() => {
      error = {
        name: 'ValidationError',
        message: 'error message'
      };
    });

    it('should return status 400', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(400);
    });

    it('should return correct error json', () => {
      expectedResult.message = error.message;
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith(expectedResult);
    });
  });

  describe('Unauthorized Error', () => {
    before(() => {
      error = {
        name: 'UnauthorizedError',
        message: 'error message'
      };
    });

    it('should return status 401', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(401);
    });

    it('should return correct error json', () => {
      expectedResult.message = 'Invalid Token.';
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith(expectedResult);
    });
  });

  describe('Not Found Error', () => {
    before(() => {
      error = {
        name: 'NotFoundError',
        message: 'error message'
      };
    });

    it('should return status 404', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(404);
    });

    it('should return correct error json', () => {
      expectedResult.message = 'Resource Not Found.';
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith(expectedResult);
    });
  });

  describe('Server Error', () => {
    before(() => {
      error = {};
    });

    it('should return status 500', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(500);
    });

    it('should return correct error json', () => {
      expectedResult.message = 'Internal Server Error';
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith(expectedResult);
    });
  });
});
