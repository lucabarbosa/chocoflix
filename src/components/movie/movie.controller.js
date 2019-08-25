import Movie from './movie.model';
import ApiError from '../../helpers/ApiError';

const MovieController = {};

MovieController.create = (req, res, next) => {
  const payload = req.body;

  return Movie.create(payload)
    .then(movie => res.status(201).json(movie))
    .catch(err => next(err));
};

MovieController.append = (req, res, next) => {
  const { id } = req.params;

  return Movie.findByIdAndUpdate(id, {
    $push: { saga: req.body }
  })
    .then(movie => res.status(201).json(movie))
    .catch(err => next(err));
};

MovieController.index = (req, res, next) => {
  return Movie.find({})
    .then(movies => res.status(200).json(movies))
    .catch(err => next(err));
};

MovieController.get = (req, res, next) => {
  const { id } = req.params;

  return Movie.findById(id)
    .then(movie => res.status(200).json(movie))
    .catch(err => next(err));
};

MovieController.getFromSaga = (req, res, next) => {
  const { id, movie } = req.params;

  return Movie.findOne({ _id: id, 'saga._id': movie })
    .then(({ saga }) => res.status(200).json(saga[movie]))
    .catch(err => next(err));
};

MovieController.update = (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  return Movie.findByIdAndUpdate(id, payload, { new: true })
    .then(movie => res.status(200).json(movie))
    .catch(err => next(err));
};

MovieController.updateOnSaga = (req, res, next) => {
  const { id, movie } = req.params;
  const payload = req.body;

  return Movie.findOneAndUpdate({ _id: id, 'saga._id': movie }, payload, {
    new: true
  })
    .then(({ saga }) => res.status(200).json(saga[movie]))
    .catch(err => next(err));
};

MovieController.destroy = (req, res, next) => {
  const { id } = req.params;

  return Movie.findByIdAndRemove(id)
    .then(movie => {
      if (movie) {
        return res.status(200).json({
          message: 'Movie deleted successfully!'
        });
      }

      throw new ApiError(404, 'Movie');
    })
    .catch(err => next(err));
};

MovieController.destroyOnSaga = (req, res, next) => {
  const { id, movie } = req.params;

  return Movie.findOneAndRemove({ _id: id, 'saga._id': movie })
    .then(movie => {
      if (movie) {
        return res.status(200).json({
          message: 'Movie deleted successfully!'
        });
      }

      throw new ApiError(404, 'Movie');
    })
    .catch(err => next(err));
};
export default MovieController;
