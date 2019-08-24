import User from './user.model';
import bcrypt from 'bcrypt';
import ApiError from '../../helpers/ApiError';

const SALT_ROUNDS = 10;

const UserController = {};

UserController.create = (req, res, next) => {
  const payload = req.body;
  const { email } = payload;

  return User.findOne({ email })
    .then(user => {
      if (user) {
        throw new ApiError(400, 'Email', 'This email is already taken.');
      }
      return bcrypt.hash(payload.password, SALT_ROUNDS);
    })
    .then(hash => {
      payload.password = hash;
      return User.create(payload);
    })
    .then(user => {
      const newUser = user.toObject();
      delete newUser.password;
      return res.status(201).json(newUser);
    })
    .catch(err => next(err));
};

UserController.index = (req, res, next) => {
  return User.find({})
    .select('-password')
    .then(users => res.status(200).json(users))
    .catch(err => next(err));
};

UserController.get = (req, res, next) => {
  const { email } = req.params;

  return User.find({ email })
    .select('-password')
    .then(user => {
      if (user.length) return res.status(200).json(user[0]);
      throw new ApiError(404, 'User');
    })
    .catch(err => next(err));
};

UserController.update = (req, res, next) => {
  const payload = req.body;
  const { password } = req.body;
  const { email } = req.params;

  payload.email = email;

  return User.findOne({ email })
    .then(user => {
      if (user) return bcrypt.compare(password, user.password);
      throw new ApiError(404, 'User');
    })
    .then(isCorrectPassword => {
      if (isCorrectPassword) {
        delete payload.password;

        if (payload.newPassword) {
          return bcrypt.hash(payload.newPassword, SALT_ROUNDS);
        }

        return false;
      }

      throw new ApiError(401, 'User', 'Invalid Password.');
    })
    .then(hash => {
      if (hash) {
        payload.password = hash;
        delete payload.newPassword;
      }

      return User.findOneAndUpdate({ email }, payload, { new: true }).select(
        '-password'
      );
    })
    .then(user => res.status(200).json(user))
    .catch(err => next(err));
};

UserController.destroy = (req, res, next) => {
  const { password } = req.body;
  const { email } = req.params;

  return User.findOne({ email })
    .then(user => {
      if (user) {
        return bcrypt.compare(password, user.password);
      }

      throw new ApiError(404, 'User');
    })
    .then(isCorrectPassword => {
      if (isCorrectPassword) {
        return User.findOneAndDelete({ email });
      }

      throw new ApiError(401, 'User', 'Invalid Password.');
    })
    .then(user =>
      res.status(200).json({
        message: 'User deleted successfully!'
      })
    )
    .catch(err => next(err));
};

export default UserController;
