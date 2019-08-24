import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import errorHandler from '../../src/helpers/error-handler';
import ApiError from '../../src/helpers/ApiError';

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

  describe('ApiError instance', () => {
    before(() => {
      error = new ApiError(400, 'User', 'User is invalid!');
    });

    it('should call status with error.code ', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(error.code);
    });

    it('should call json with error.message', () => {
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith({ message: error.message });
    });
  });

  describe('Custom Error', () => {
    before(() => {
      error = new Error('An error occurred.');
    });

    it('should call status with default code', () => {
      errorHandler(error, req, res);
      expect(res.status).to.have.been.calledWith(400);
    });

    it('should call json with error.message', () => {
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith({ message: error.message });
    });

    it('should call json with default message if no message is passed', () => {
      error = new Error();
      errorHandler(error, req, res);
      expect(res.json).to.have.been.calledWith({ message: 'Internal Error.' });
    });
  });
});
