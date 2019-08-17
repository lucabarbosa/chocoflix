import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import bcrypt from 'bcrypt';

import User from '../../../src/components/user/user.model';
import UserController from '../../../src/components/user/user.controller';

chai.use(sinonChai);

describe('User: Controller', () => {
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
  const next = sinon.spy();

  // Errors
  const error = new Error({ error: 'error message' });

  const NotFoundError = {
    name: 'NotFoundError',
    message: 'User Not Found.'
  };

  const UnauthorizedError = {
    name: 'UnauthorizedError',
    message: 'Invalid Password.'
  };

  // Results
  let expectedResult;

  // Mocks
  let findMock;

  before(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
  });

  beforeEach(() => {
    findMock = {
      data: {},
      select: function(params) {
        return Promise.resolve(this.data);
      }
    };
  });

  describe('create() user', () => {
    let bcryptStub;
    let userCreateStub;
    let userFindOneStub;

    beforeEach(() => {
      expectedResult = {};
      bcryptStub = sinon.stub(bcrypt, 'hash').resolves('bla');
      userCreateStub = sinon.stub(User, 'create');
      userFindOneStub = sinon.stub(User, 'findOne').resolves(expectedResult);
    });

    afterEach(() => {
      bcryptStub.restore();
      userCreateStub.restore();
      userFindOneStub.restore();
    });

    it('should check if user exists', () => {
      const { email } = req.body;

      return UserController.create(req, res, next).then(() => {
        expect(userFindOneStub).to.have.been.calledWith({ email });
      });
    });

    it('should call next with error if user exists', () => {
      const { email } = req.body;

      return UserController.create(req, res, next).then(() => {
        expect(userFindOneStub).to.have.been.calledWith({ email });
        expect(next).to.have.been.calledWith('This email is already taken.');
      });
    });

    it('should encrypt user password', () => {
      const { password } = req.body;

      userFindOneStub.resolves();

      return UserController.create(req, res, next).then(() => {
        expect(bcryptStub).to.have.been.calledWith(password);
      });
    });

    it('should return created user object', () => {
      expectedResult = { ...req.body };
      delete expectedResult.password;

      userFindOneStub.resolves();
      userCreateStub.resolves({
        data: {
          ...req.body
        },
        toObject: function() {
          const data = { ...this.data };
          delete data.password;
          return data;
        }
      });

      return UserController.create(req, res, next).then(() => {
        expect(userCreateStub).to.have.been.calledWith(req.body);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next when an error occurs', () => {
      userFindOneStub.resolves();
      userCreateStub.rejects(error);

      return UserController.create(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('index() [] user', () => {
    let model = {};

    beforeEach(() => {
      model = sinon.stub(User, 'find');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return an array of users or empty array', () => {
      expectedResult = [{}, {}];
      findMock.data = [...expectedResult];
      model.returns(findMock);

      return UserController.index(req, res, next).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next when an error occurs', () => {
      expectedResult = [{}, {}];
      findMock.select = function(params) {
        return Promise.reject(error);
      };
      model.returns(findMock);

      return UserController.index(req, res, next).then(() => {
        expect(model).to.have.been.called;
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('get() [] user', () => {
    let model = {};

    beforeEach(() => {
      model = sinon.stub(User, 'find');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return a user object', () => {
      expectedResult = { ...req.body };
      findMock.data = [expectedResult];
      model.returns(findMock);

      return UserController.get(req, res, next).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next with Not Found Error when user doesnt exists', () => {
      findMock.data = [];
      model.returns(findMock);

      return UserController.get(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(NotFoundError);
      });
    });

    it('should call next with error when an error occurs', () => {
      findMock.select = function(params) {
        return Promise.reject(error);
      };

      model.returns(findMock);

      return UserController.get(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('update() user', () => {
    let model;
    let bcryptStub, findStub;

    beforeEach(() => {
      bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);
      findStub = sinon.stub(User, 'findOne').resolves(req.body);
      model = sinon.stub(User, 'findOneAndUpdate');
    });

    afterEach(() => {
      bcryptStub.restore();
      findStub.restore();
      model.restore();
    });

    it('should check if password is correct before update user', () => {
      const { password } = req.body;

      model.resolves(req.body);

      return UserController.update(req, res, next).then(() => {
        expect(bcryptStub).to.have.been.calledWith(password);
      });
    });

    it('should call next with Unauthorized Error when password is incorrect', () => {
      bcryptStub.resolves(false);

      return UserController.update(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(UnauthorizedError);
      });
    });

    it('should call next with Not Found Error when user doesnt exists', () => {
      findStub.resolves();

      return UserController.update(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(NotFoundError);
      });
    });

    it('should lock to update email', () => {
      const req2 = {
        body: {
          email: 'outroteste@gmail.com',
          password: 'teste'
        },
        params: {
          email: 'teste@gmail.com'
        }
      };

      expectedResult = { ...req2.body };
      expectedResult.email = req2.params.email;

      findMock.data = { ...expectedResult };

      model.returns(findMock);

      return UserController.update(req2, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should allow you to change the password', () => {
      const req2 = {
        body: {
          email: 'teste@gmail.com',
          password: 'teste',
          newPassword: 'lucas'
        },
        params: {
          email: 'teste@gmail.com'
        }
      };

      expectedResult = { email: 'teste@gmail.com', password: 'lucas' };

      findMock.data = { ...expectedResult };

      model.returns(findMock);

      return UserController.update(req2, res, next).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return a updated user object', () => {
      const { email } = req.params;

      expectedResult = { ...req.body };

      findMock.data = { ...expectedResult };

      model.returns(findMock);

      return UserController.update(req, res, next).then(() => {
        expect(model).to.have.been.calledWith({ email }, req.body, {
          new: true
        });
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should call next with error when an error occurs', () => {
      findMock.select = function(params) {
        return Promise.reject(error);
      };

      model.returns(findMock);

      return UserController.update(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroy() {}', () => {
    let bcryptStub;
    let findStub;
    let model;

    beforeEach(() => {
      bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);
      findStub = sinon.stub(User, 'findOne').resolves(req.body);
      model = sinon.stub(User, 'findOneAndDelete');
    });

    afterEach(() => {
      bcryptStub.restore();
      findStub.restore();
      model.restore();
    });

    it('should call next with Unauthorized Error when password is incorrect', () => {
      bcryptStub = bcryptStub.resolves(false);

      return UserController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(UnauthorizedError);
      });
    });

    it('should call next with Not Found Error when user doesnt exists', () => {
      findStub = findStub.resolves();

      return UserController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(NotFoundError);
      });
    });

    it('should return a succesful deletation message', () => {
      const { email } = req.params;

      expectedResult = {
        message: 'User deleted successfully!'
      };

      model = model.resolves({});

      return UserController.destroy(req, res, next).then(() => {
        expect(model).to.have.been.calledWith({ email });
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('shoud call next with error when an error occurs', () => {
      model = model.rejects(error);

      return UserController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });
});
