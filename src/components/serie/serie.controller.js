import Serie from './serie.model';
import ApiError from '../../helpers/ApiError';

import getPartialSubdocumentUpdatePayload from '../../utils/getPartialSubdocumentUpdatePayload';

const SerieController = {};

SerieController.create = (req, res, next) => {
  const payload = req.body;

  return Serie.create(payload)
    .then(serie => res.status(201).json(serie))
    .catch(err => next(err));
};

SerieController.appendSeason = (req, res, next) => {
  const { serie } = req.params;

  return Serie.findByIdAndUpdate(
    serie,
    {
      $push: { seasons: { episodes: [] } }
    },
    { new: true }
  )
    .then(serieFromDb => {
      if (serieFromDb) return res.status(201).json(serieFromDb);
      throw new ApiError(404, 'Serie');
    })
    .catch(err => next(err));
};

SerieController.appendEpisode = (req, res, next) => {
  const { serie, season } = req.params;
  const payload = req.body;

  return Serie.findOneAndUpdate(
    { _id: serie, 'seasons._id': season },
    {
      $push: { 'seasons.$.episodes': payload }
    },
    { new: true }
  )
    .then(serieFromDb => {
      if (!serieFromDb) throw new ApiError(404, 'Serie');
      else if (!serieFromDb.seasons.id(season))
        throw new ApiError(404, 'Season');

      return res.status(201).json(serieFromDb);
    })
    .catch(err => next(err));
};

SerieController.index = (req, res, next) => {
  return Serie.find({})
    .then(series => res.status(200).json(series))
    .catch(err => next(err));
};

SerieController.get = (req, res, next) => {
  const { serie } = req.params;

  return Serie.findById(serie)
    .then(serieFromDb => {
      if (serieFromDb) return res.status(200).json(serieFromDb);
      throw new ApiError(404, 'Serie');
    })
    .catch(err => next(err));
};

SerieController.getSeason = (req, res, next) => {
  const { serie, season } = req.params;

  return Serie.findOne({ _id: serie, 'seasons._id': season })
    .then(serieFromDb => {
      if (!serieFromDb) throw new ApiError(404, 'Serie');

      const seasonOfSerie = serieFromDb.seasons.id(season);

      if (seasonOfSerie) return res.status(200).json(seasonOfSerie);

      throw new ApiError(404, 'Season');
    })
    .catch(err => next(err));
};

SerieController.getEpisode = (req, res, next) => {
  const { serie, season, episode } = req.params;

  return Serie.findOne({
    _id: serie,
    'seasons._id': season,
    'seasons.episodes._id': episode
  })
    .then(serieFromDb => {
      if (!serieFromDb) throw new ApiError(404, 'Serie');

      const episodeOfSerie = serieFromDb.seasons
        .id(season)
        .episodes.id(episode);

      if (episodeOfSerie) return res.status(200).json(episodeOfSerie);

      throw new ApiError(404, 'Episode');
    })
    .catch(err => next(err));
};

SerieController.update = (req, res, next) => {
  const { serie } = req.params;
  const payload = req.body;

  return Serie.findByIdAndUpdate(serie, payload, { new: true })
    .then(serieFromDb => {
      if (serieFromDb) return res.status(200).json(serieFromDb);
      throw new ApiError(404, 'Serie');
    })
    .catch(err => next(err));
};

SerieController.updateSeason = (req, res, next) => {
  const { serie, season } = req.params;
  const payload = getPartialSubdocumentUpdatePayload('seasons', req.body);

  return Serie.findOneAndUpdate(
    { _id: serie, 'seasons._id': season },
    payload,
    { new: true }
  )
    .then(serieFromDb => {
      if (serieFromDb) {
        const seasonOfSerie = serieFromDb.seasons.id(season);
        if (seasonOfSerie) return res.status(200).json(seasonOfSerie);
      }

      throw new ApiError(404, 'Serie');
    })
    .catch(err => next(err));
};

SerieController.updateEpisode = (req, res, next) => {
  const { serie, season, episode } = req.params;
  const payload = getPartialSubdocumentUpdatePayload(
    'seasons.$[season].episodes',
    req.body
  );

  return Serie.findOneAndUpdate(
    { _id: serie, 'seasons._id': season, 'seasons.episodes._id': episode },
    payload,
    {
      arrayFilters: [{ 'season._id': season }],
      new: true
    }
  )
    .then(serieFromDb => {
      if (!serieFromDb) throw new ApiError(404, 'Serie');

      const episodeOfSerie = serieFromDb.seasons
        .id(season)
        .episodes.id(episode);

      if (episodeOfSerie) return res.status(200).json(episodeOfSerie);

      throw new ApiError(404, 'Episode');
    })
    .catch(err => next(err));
};

SerieController.destroy = (req, res, next) => {
  const { serie } = req.params;

  return Serie.findByIdAndRemove(serie)
    .then(serieFromDb => {
      if (serieFromDb) {
        return res.status(200).json({
          message: 'Serie deleted successfully!'
        });
      }

      throw new ApiError(404, 'Serie');
    })
    .catch(err => next(err));
};

SerieController.destroySeason = (req, res, next) => {
  const { serie, season } = req.params;

  return Serie.findOneAndUpdate(
    { _id: serie, 'seasons._id': season },
    { $pull: { seasons: { _id: season } } },
    { new: true }
  )
    .then(serieFromDb => {
      if (!serieFromDb) throw new ApiError(404, 'Season');

      const seasonIsOnSerie = serieFromDb.seasons.id(season);

      if (!seasonIsOnSerie) {
        return res.status(200).json({
          message: 'Season deleted successfully!'
        });
      }

      throw new ApiError(404, 'Season');
    })
    .catch(err => next(err));
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
