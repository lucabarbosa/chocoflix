import chai, { expect } from 'chai';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../../src/components/user/user.model';
import AuthController from '../../../src/components/auth/auth.controller';

import ApiConfig from '../../../src/config';
import ApiError from '../../../src/helpers/ApiError';

chai.use(sinonChai);

describe('Auth: Controller', () => {
  // Express Functions
  const req = {
    body: {
      email: 'teste@gmail.com',
      password: 'teste'
    },
    params: {
      email: 'teste@gmail.com'
    }
  };
  const res = {};
  let next;

  // Errors
  const NotFoundError = new ApiError(404, 'User');
  const UnauthorizedError = new ApiError(401, 'User', 'Invalid Password.');

  before(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
  });

  beforeEach(() => {
    next = sinon.spy();
  });

  describe('login() jwt', () => {
    const payload = {
      email: req.body.email,
      name: 'Lucas',
      password: 'teste',
      _id: 'ASD859A52C6147KL'
    };

    const token = 'TOKENTOKENTOKEN.TOKENTOKEN.NEKOTNEKOT';

    let bcryptStub, findStub, jwtStub;

    beforeEach(() => {
      bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);
      findStub = sinon.stub(User, 'findOne').resolves(payload);
      jwtStub = sinon.stub(jwt, 'sign').resolves(token);
    });

    afterEach(() => {
      bcryptStub.restore();
      findStub.restore();
      jwtStub.restore();
    });

    it('should get auth from database', () => {
      return AuthController.login(req, res, next).then(() => {
        expect(findStub).to.have.been.calledWith({ email: req.body.email });
      });
    });

    it('should call next with Not Found Error when auth doesnt exists', () => {
      findStub.resolves();

      return AuthController.login(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(NotFoundError.code);
        expect(calledError.message).to.be.equal(NotFoundError.message);
      });
    });

    it('should check if password is correct', () => {
      findStub.resolves({ password: 'lucas' });
      return AuthController.login(req, res, next).then(() => {
        expect(bcryptStub).to.have.been.calledWith(req.body.password);
      });
    });

    it('should call next with Unauthorized Error when password is incorrect', () => {
      return AuthController.login(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(UnauthorizedError.code);
        expect(calledError.message).to.be.equal(UnauthorizedError.message);
      });
    });

    it('should get token with jwt if password is correct', () => {
      bcryptStub.resolves(true);

      return AuthController.login(req, res, next).then(() => {
        expect(jwtStub).to.have.been.calledWith(
          { email: payload.email, name: payload.name, id: payload._id },
          ApiConfig.SECRET,
          { expiresIn: 300 }
        );
      });
    });

    it('should call res.json with jwt', () => {
      bcryptStub.resolves(true);

      return AuthController.login(req, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(token);
        expect(res.status).to.have.been.calledWith(200);
      });
    });
  });

  describe('isLogged()', () => {
    let jwtStub;

    beforeEach(() => {
      jwtStub = sinon.stub(jwt, 'verify').resolves(true);
    });

    afterEach(() => {
      jwtStub.restore();
    });

    it('should call next with Unauthorized Error if token isnt in req.header', () => {
      AuthController.isLogged(req, res, next);
      expect(next).to.have.been.called;

      const calledError = next.firstCall.args[0];

      expect(calledError).to.be.an.instanceOf(ApiError);
      expect(calledError.code).to.be.equal(UnauthorizedError.code);
    });

    it('should check token with jwt.verify', () => {
      req.headers = {
        'x-access-token': 'TOKEN'
      };

      return AuthController.isLogged(req, res, next).then(() => {
        expect(jwtStub).to.have.been.calledWith(
          req.headers['x-access-token'],
          ApiConfig.SECRET
        );
      });
    });
  });
});
