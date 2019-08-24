import ApiError from './ApiError';

export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.code).json({ message: err.message });
  }

  return res.status(400).json({ message: err.message || 'Internal Error.' });
}
