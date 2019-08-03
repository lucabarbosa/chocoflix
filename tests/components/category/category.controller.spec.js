import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Category from '../../../src/components/category/category.model';
import CategoryController from '../../../src/components/category/category.controller';

chai.use(sinonChai);

describe('Category: Controller', () => {
  const req = {
    body: {
      name: 'Ação'
    },
    params: {
      id: '5aa06bb80738152cfd536fdc'
    }
  };

  const error = new Error({ error: 'error message' });
  const res = {};
  let expectedResult;

  describe('create() category', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'create');
      res.json = sinon.spy();
      res.status = sinon.stub().returns(res);
    });

    afterEach(() => {
      model.restore();
    });

    it('should return created category object', () => {
      expectedResult = req.body;

      model = model.resolves(expectedResult);

      return CategoryController.create(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.body);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 400 when an error occurs', () => {
      model = model.rejects(error);

      return CategoryController.create(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.body);
        expect(res.json).to.have.been.calledWith(error);
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('index() [] category', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'find');
      res.json = sinon.spy();
      res.status = sinon.stub().returns(res);
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

      model = model.resolves(expectedResult);

      return CategoryController.index(req, res).then(() => {
        expect(model).to.have.been.calledWith({});
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 400 when an error occurs', () => {
      model = model.rejects(error);

      return CategoryController.index(req, res).then(() => {
        expect(model).to.have.been.calledWith({});
        expect(res.json).to.have.been.calledWith(error);
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('get() category', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'findById');
      res.json = sinon.spy();
      res.status = sinon.stub().returns(res);
    });

    afterEach(() => {
      model.restore();
    });

    it('should return a category object', () => {
      expectedResult = {
        name: 'Ação'
      };

      model = model.resolves(expectedResult);

      return CategoryController.get(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(200);
      });
    });

    it('should return 404 if category doesnt exists', () => {
      model = model.resolves();

      return CategoryController.get(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return 400 if an error occurs', () => {
      model = model.rejects(error);

      return CategoryController.get(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(error);
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('update() {}', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'findByIdAndUpdate');
      res.json = sinon.spy();
      res.status = sinon.stub().returns(res);
    });

    afterEach(() => {
      model.restore();
    });

    it('should return updated category object', () => {
      expectedResult = req.body;

      model = model.resolves(expectedResult);

      return CategoryController.update(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 404 if category doesnt exists', () => {
      model = model.resolves();

      return CategoryController.update(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return 400 if an error occurs', () => {
      model = model.rejects(error);

      return CategoryController.update(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(error);
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });

  describe('destroy() {}', () => {
    let model;

    beforeEach(() => {
      model = sinon.stub(Category, 'findByIdAndRemove');
      res.json = sinon.spy();
      res.status = sinon.stub().returns(res);
    });

    afterEach(() => {
      model.restore();
    });

    it('should return successful deletion message', () => {
      expectedResult = {
        message: 'Category deleted successfully!'
      };

      model = model.resolves({});

      return CategoryController.destroy(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(expectedResult);
        expect(res.status).to.have.been.calledWith(201);
      });
    });

    it('should return 404 if category doesnt exists', () => {
      model = model.resolves();

      return CategoryController.destroy(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.status).to.have.been.calledWith(404);
      });
    });

    it('should return 400 if an error occurs', () => {
      model = model.rejects(error);

      return CategoryController.destroy(req, res).then(() => {
        expect(model).to.have.been.calledWith(req.params.id);
        expect(res.json).to.have.been.calledWith(error);
        expect(res.status).to.have.been.calledWith(400);
      });
    });
  });
});
