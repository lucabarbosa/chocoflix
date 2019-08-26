import Serie from './serie.model';
import ApiError from '../../helpers/ApiError';

const SerieController = {};

SerieController.create = (req, res, next) => {
  const payload = req.body;

  return Serie.create(payload)
    .then(serie => res.status(201).json(serie))
    .catch(err => res.status(400).json(err));
};

SerieController.appendSeason = (req, res, next) => {
  const { id } = req.params;

  return Serie.findByIdAndUpdate(id, {
    $push: { seasons: { episodes: [] } }
  })
    .then(serie => res.status(201).json(serie))
    .catch(err => res.status(400).json(err));
};

SerieController.appendEpisode = (req, res, next) => {
  const { id, season } = req.params;
  const payload = req.body;

  return Serie.findOneAndUpdate(
    { _id: id, 'seasons._id': season },
    {
      $push: { episodes: payload }
    }
  )
    .then(serie => res.status(201).json(serie))
    .catch(err => res.status(400).json(err));
};

SerieController.index = (req, res, next) => {
  return Serie.find({})
    .then(series => res.status(200).json(series))
    .catch(err => res.status(400).json(err));
};

SerieController.get = (req, res, next) => {
  const { id } = req.params;

  return Serie.findById(id)
    .then(serie => res.status(200).json(serie))
    .catch(err => res.status(400).json(err));
};

SerieController.getSeason = (req, res, next) => {
  const { id, season } = req.params;

  return Serie.findOne({ _id: id, 'seasons._id': season })
    .then(({ seasons }) => res.status(200).json(seasons[season]))
    .catch(err => res.status(400).json(err));
};

SerieController.update = (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  return Serie.findByIdAndUpdate(id, payload, { new: true })
    .then(serie => res.status(200).json(serie))
    .catch(err => res.status(400).json(err));
};

SerieController.updateSeason = (req, res, next) => {
  const { id, season } = req.params;
  const payload = req.body;

  return Serie.findOneAndUpdate({ _id: id, 'seasons._id': season }, payload, {
    new: true
  })
    .then(({ seasons }) => res.status(200).json(seasons[season]))
    .catch(err => res.status(400).json(err));
};

SerieController.updateEpisode = (req, res, next) => {
  const { id, season, episode } = req.params;
  const payload = req.body;

  return Serie.findOneAndUpdate(
    { _id: id, 'seasons._id': season, 'seasons.$.episodes._id': episode },
    payload,
    {
      new: true
    }
  )
    .then(({ seasons }) =>
      res.status(200).json(seasons[season].episodes[episode])
    )
    .catch(err => res.status(400).json(err));
};

SerieController.destroy = (req, res, next) => {
  const { id } = req.params;

  return Serie.findByIdAndRemove(id)
    .then(serie => {
      if (serie)
        return res.status(200).json({
          message: 'Serie deleted successfully!'
        });
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

SerieController.destroySeason = (req, res, next) => {
  const { id, season } = req.params;

  return Serie.findOneAndRemove({ _id: id, 'seasons._id': season })
    .then(deleted => {
      if (deleted)
        return res.status(200).json({
          message: 'Season deleted successfully!'
        });
      res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

SerieController.destroyEpisode = (req, res, next) => {
  const { serie, season, episode } = req.params;

  return Serie.findOneAndUpdate(
    { _id: serie, 'seasons._id': season },
    { $pull: { 'seasons.$.episodes': { _id: episode } } },
    { new: true }
  )
    .then(serieFromDb => {
      if (!serieFromDb) throw new ApiError(404, 'Episode');

      const episodeIsOnSeason = serieFromDb.seasons
        .id(season)
        .episodes.id(episode);

      if (!episodeIsOnSeason) {
        return res.status(200).json({
          message: 'Episode deleted successfully!'
        });
      }

      throw new ApiError(500, 'Episode');
    })
    .catch(err => next(err));
};

export default SerieController;
