import Category from './category.model';
import ApiError from '../../helpers/ApiError';

const CategoryController = {};

CategoryController.create = (req, res, next) => {
  const payload = req.body;

  return Category.create(payload)
    .then(category => res.status(201).json(category))
    .catch(err => next(err));
};

CategoryController.index = (req, res, next) => {
  return Category.find({})
    .then(categories => res.status(200).json(categories))
    .catch(err => next(err));
};

CategoryController.get = (req, res, next) => {
  const { id } = req.params;
  return Category.findById(id)
    .then(category => {
      if (category) return res.status(200).json(category);
      throw new ApiError(404, 'Category');
    })
    .catch(err => next(err));
};

CategoryController.update = (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  return Category.findByIdAndUpdate(id, payload)
    .then(category => {
      if (category) return res.status(201).json(category);
      throw new ApiError(404, 'Category');
    })
    .catch(err => next(err));
};

CategoryController.destroy = (req, res, next) => {
  const { id } = req.params;
  return Category.findByIdAndRemove(id)
    .then(category => {
      if (category) {
        return res.status(201).json({
          message: 'Category deleted successfully!'
        });
      }

      throw new ApiError(404, 'Category');
    })
    .catch(err => next(err));
};

export default CategoryController;
