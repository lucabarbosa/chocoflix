import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import bcrypt from 'bcrypt';

import User from '../../../src/components/user/user.model';
import UserController from '../../../src/components/user/user.controller';

chai.use(sinonChai);

describe('User: Controller', () => {
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

  const error = new Error({ error: 'error message' });

  let expectedResult;

  beforeEach(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
  });

  describe('create() user', () => {
    let model;
    let bcryptStub;

    beforeEach(() => {
      bcryptStub = sinon.stub(bcrypt, 'hash').resolves('bla');
    });

    afterEach(() => {
      bcryptStub.restore();
      model.restore();
    });

    it('should check if user exists', () => {
      const { email } = req.body;

      expectedResult = {};

      model = sinon.stub(User, 'findOne').resolves(expectedResult);

      return UserController.create(req, res).then(() => {
        expect(model).to.have.been.calledWith({ email });
      });
    });

    it('should return error is user exists', () => {
      const { email } = req.body;

      expectedResult = {};

      model = sinon.stub(User, 'findOne').resolves(expectedResult);

      return UserController.create(req, res).then(() => {
        expect(model).to.have.been.calledWith({ email });
        expect(res.status).to.have.been.calledWith(400);
      });
    });

    it('should encrypt user password', () => {
      const { password } = req.body;

      model = sinon.stub(User, 'findOne').resolves();

      return UserController.create(req, res).then(() => {
        expect(bcryptStub).to.have.been.calledWith(password);
      });
    });

    it('should return created user object', () => {
      expectedResult = req.body;

      const findOne = sinon.stub(User, 'findOne').resolves();
      model = sinon.stub(User, 'create').resolves(expectedResult);

      return UserController.create(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.body);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
        findOne.restore();
      });
    });

    it('should return 400 when an error occurs', () => {
      const findOne = sinon.stub(User, 'findOne').resolves();
      model = sinon.stub(User, 'create').rejects(error);

      return UserController.create(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.body);
        expect(res.json).to.have.been.calledWith(error);
        expect(res.status).to.have.been.calledWith(400);
        findOne.restore();
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
      model = model.resolves(expectedResult);

      return UserController.index(req, res).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 400 when an error occurs', () => {
      model = model.rejects(error);

      return UserController.index(req, res).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith(error);
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
      expectedResult = req.body;
      model = model.resolves(expectedResult);

      return UserController.get(req, res).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 404 when user doesnt exists', () => {
      model = model.resolves();

      return UserController.get(req, res).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return 400 when an error occurs', () => {
      model = model.rejects(error);

      return UserController.get(req, res).then(() => {
        expect(model).to.have.been.called;
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith(error);
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

      return UserController.update(req, res).then(() => {
        expect(bcryptStub).to.have.been.calledWith(password);
      });
    });

    it('should return 401 when password is incorrect', () => {
      bcryptStub.resolves(false);

      return UserController.update(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(401);
      });
    });

    it('should return 404 when user doesnt exists', () => {
      findStub.resolves();

      return UserController.update(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(404);
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

      expectedResult = { ...req.body };
      expectedResult.email = req.params.email;

      model.resolves(expectedResult);

      return UserController.update(req2, res).then(() => {
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

      model.resolves(expectedResult);

      return UserController.update(req2, res).then(() => {
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return a updated user object', () => {
      const { email } = req.params;

      expectedResult = req.body;

      model.resolves(expectedResult);

      return UserController.update(req, res).then(() => {
        expect(model).to.have.been.calledWith({ email }, req.body, {
          new: true
        });
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('should return 400 when an error occurs', () => {
      model.rejects(error);

      return UserController.update(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith(error);
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

    it('should return 401 when password is incorrect', () => {
      bcryptStub = bcryptStub.resolves(false);

      return UserController.destroy(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(401);
      });
    });

    it('should return 404 when user doesnt exists', () => {
      findStub = findStub.resolves();

      return UserController.destroy(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return a succesful deletation message', () => {
      const { email } = req.params;

      expectedResult = {
        message: 'User deleted successfully!'
      };

      model = model.resolves({});

      return UserController.destroy(req, res).then(() => {
        expect(model).to.have.been.calledWith({ email });
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith(expectedResult);
      });
    });

    it('shoud return 400 when an error occurs', () => {
      model = model.rejects(error);

      return UserController.destroy(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith(error);
      });
    });
  });

  describe('updatePassword() user', () => {});
});
