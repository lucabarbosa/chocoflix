export default function errorHandler(err, req, res) {
  if (typeof err === 'string') {
    return res.status(400).json({ message: err });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid Token.' });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ message: 'Resource Not Found.' });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
}
