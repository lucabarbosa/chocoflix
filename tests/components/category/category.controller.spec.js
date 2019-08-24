import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Category from '../../../src/components/category/category.model';
import CategoryController from '../../../src/components/category/category.controller';

import ApiError from '../../../src/helpers/ApiError';

chai.use(sinonChai);

describe.only('Category: Controller', () => {
  // Express Params
  const req = {
    body: {
      name: 'Ação'
    },
    params: {
      id: '5aa06bb80738152cfd536fdc'
    }
  };

  const res = {};
  let next;

  // Errors
  const error = new ApiError();
  const notFoundError = new ApiError(404, 'Category');

  // Results
  let expectedResult;

  // Mocks
  beforeEach(() => {
    res.json = sinon.spy();
    res.status = sinon.stub().returns(res);
    next = sinon.spy();
  });

  describe('create() category', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'create');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return created category object', () => {
      expectedResult = req.body;

      model.resolves(expectedResult);

      return CategoryController.create(req, res, next).then(() => {
        expect(model).to.have.been.calledWith(req.body);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should call next with error when an error occurs', () => {
      model.rejects(error);

      return CategoryController.create(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('index() [] category', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'find');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return an array of categories or empty array', () => {
      expectedResult = [
        {
          name: 'Ação'
        },
        {
          name: 'Comédia'
        }
      ];

      model.resolves(expectedResult);

      return CategoryController.index(req, res, next).then(() => {
        expect(model).to.have.been.calledWith({});
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should call next with error when and error occurs', () => {
      model.rejects(error);

      return CategoryController.index(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('get() category', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'findById');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return a category object', () => {
      expectedResult = {
        name: 'Ação'
      };

      model.resolves(expectedResult);

      return CategoryController.get(req, res, next).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 404 if category doesnt exists', () => {
      model.resolves();

      return CategoryController.get(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(notFoundError.code);
        expect(calledError.message).to.be.equal(notFoundError.message);
      });
    });

    it('should return 400 if an error occurs', () => {
      model.rejects(error);

      return CategoryController.get(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('update() {}', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'findByIdAndUpdate');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return updated category object', () => {
      expectedResult = req.body;

      model.resolves(expectedResult);

      return CategoryController.update(req, res, next).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 404 if category doesnt exists', () => {
      model.resolves();

      return CategoryController.update(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(notFoundError.code);
        expect(calledError.message).to.be.equal(notFoundError.message);
      });
    });

    it('should return 400 if an error occurs', () => {
      model.rejects(error);

      return CategoryController.update(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });

  describe('destroy() {}', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'findByIdAndRemove');
    });

    afterEach(() => {
      model.restore();
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Category deleted successfully!'
      };

      model.resolves({});

      return CategoryController.destroy(req, res, next).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 404 if category doesnt exists', () => {
      model.resolves();

      return CategoryController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.called;

        const calledError = next.firstCall.args[0];

        expect(calledError).to.be.an.instanceOf(ApiError);
        expect(calledError.code).to.be.equal(notFoundError.code);
        expect(calledError.message).to.be.equal(notFoundError.message);
      });
    });

    it('should return 400 if an error occurs', () => {
      model.rejects(error);

      return CategoryController.destroy(req, res, next).then(() => {
        expect(next).to.have.been.calledWith(error);
      });
    });
  });
});
