import Movie from './movie.model';

const MovieController = {};

MovieController.create = (req, res) => {
  const payload = req.body;

  return Movie.create(payload)
    .then(movie => res.status(201).json(movie))
    .catch(err => res.status(400).json(err));
};

MovieController.append = (req, res) => {
  const { id } = req.params;

  return Movie.findByIdAndUpdate(id, {
    $push: { saga: req.body }
  })
    .then(movie => res.status(201).json(movie))
    .catch(err => res.status(400).json(err));
};

MovieController.index = (req, res) => {
  return Movie.find({})
    .then(movies => res.status(200).json(movies))
    .catch(err => res.status(400).json(err));
};

MovieController.get = (req, res) => {
  const { id } = req.params;

  return Movie.findById(id)
    .then(movie => res.status(200).json(movie))
    .catch(err => res.status(400).json(err));
};

MovieController.getFromSaga = (req, res) => {
  const { id, movie } = req.params;

  return Movie.findOne({ _id: id, 'saga._id': movie })
    .then(({ saga }) => res.status(200).json(saga[movie]))
    .catch(err => res.status(400).json(err));
};

MovieController.update = (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  return Movie.findByIdAndUpdate(id, payload, { new: true })
    .then(movie => res.status(200).json(movie))
    .catch(err => res.status(400).json(err));
};

MovieController.updateOnSaga = (req, res) => {
  const { id, movie } = req.params;
  const payload = req.body;

  return Movie.findOneAndUpdate({ _id: id, 'saga._id': movie }, payload, {
    new: true
  })
    .then(({ saga }) => res.status(200).json(saga[movie]))
    .catch(err => res.status(400).json(err));
};

MovieController.destroy = (req, res) => {
  const { id } = req.params;

  return Movie.findByIdAndRemove(id)
    .then(movie => {
      if (movie)
        return res.status(200).json({
          message: 'Movie deleted successfully!'
        });
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

MovieController.destroyOnSaga = (req, res) => {
  const { id, movie } = req.params;

  return Movie.findOneAndRemove({ _id: id, 'saga._id': movie })
    .then(movie => {
      if (movie)
        return res.status(200).json({
          message: 'Movie deleted successfully!'
        });
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};
export default MovieController;
