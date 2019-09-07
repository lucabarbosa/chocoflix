import User from '../user/user.model';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import ApiConfig from '../../config';
import ApiError from '../../helpers/ApiError';

const AuthController = {};

AuthController.login = (req, res, next) => {
  const { email, password } = req.body;
  const payload = { email };

  return User.findOne({ email })
    .then(user => {
      if (user) {
        payload.id = user._id;
        payload.name = user.name;
        return bcrypt.compare(password, user.password);
      }

      throw new ApiError(404, 'User');
    })
    .then(isCorrectPassword => {
      if (isCorrectPassword)
        return jwt.sign(payload, ApiConfig.SECRET, { expiresIn: 300 });

      throw new ApiError(401, 'User', 'Invalid Password.');
    })
    .then(jwt => res.status(200).json(jwt))
    .catch(err => next(err));
};

AuthController.isLogged = (req, res, next) => {
  const { 'x-access-token': token } = req.headers || {};

  if (!token) return next(new ApiError(401, 'Token'));

  return jwt
    .verify(token, ApiConfig.SECRET)
    .then(data => {
      next();
    })
    .catch(err => next(new ApiError(401, 'Token')));
};

export default AuthController;
