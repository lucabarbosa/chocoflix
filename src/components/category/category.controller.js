import Category from './category.model';

const CategoryController = {};

CategoryController.create = (req, res) => {
  const { body: payload } = req;
  return Category.create(payload)
    .then(category => res.status(201).json(category))
    .catch(err => res.status(400).json(err));
};

CategoryController.index = (req, res) => {
  return Category.find({})
    .then(categories => res.status(200).json(categories))
    .catch(err => res.status(400).json(err));
};

CategoryController.get = (req, res) => {
  const { id } = req.params;
  return Category.findById(id)
    .then(category => {
      if (category) return res.status(200).json(category);
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

CategoryController.update = (req, res) => {
  const { id } = req.params;
  return Category.findByIdAndUpdate(id)
    .then(category => {
      if (category) return res.status(201).json(category);
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

CategoryController.destroy = (req, res) => {
  const { id } = req.params;
  return Category.findByIdAndRemove(id)
    .then(category => {
      if (category)
        return res.status(201).json({
          message: 'Category deleted successfully!'
        });
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

export default CategoryController;
