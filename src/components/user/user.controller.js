import User from './user.model';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const UserController = {};

UserController.create = (req, res) => {
  const payload = req.body;
  const { email } = payload;

  return User.findOne({ email })
    .then(user => {
      if (user) {
        throw new Error('This email is already taken.');
      } else {
        return bcrypt.hash(payload.password, SALT_ROUNDS);
      }
    })
    .then(hash => {
      payload.password = hash;
      return User.create(payload);
    })
    .then(user => res.status(201).json(user))
    .catch(err => res.status(400).json(err));
};

UserController.index = (req, res) => {
  return User.find({})
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err));
};

UserController.get = (req, res) => {
  const { email } = req.params;

  return User.find({ email })
    .then(user => {
      if (user) return res.status(200).json(user);
      return res.status(404);
    })
    .catch(err => res.status(400).json(err));
};

UserController.update = (req, res) => {
  const payload = req.body;
  const { password } = req.body;
  const { email } = req.params;
  payload.email = email;

  return User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404);
      return bcrypt.compare(password, user.password);
    })
    .then(isCorrectPassword => {
      if (isCorrectPassword) {
        if (payload.newPassword)
          return bcrypt.hash(payload.newPassword, SALT_ROUNDS);
        return false;
      }
      return res.status(401);
    })
    .then(hash => {
      if (hash) {
        payload.password = hash;
        delete payload.newPassword;
      } else {
        delete payload.password;
      }
      return User.findOneAndUpdate({ email }, payload, { new: true });
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err));
};

UserController.destroy = (req, res) => {
  const { password } = req.body;
  const { email } = req.params;

  return User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404);
      return bcrypt.compare(password, user.params);
    })
    .then(isCorrectPassword => {
      if (isCorrectPassword) return User.findOneAndDelete({ email });
      return res.status(401);
    })
    .then(user =>
      res.status(200).json({
        message: 'User deleted successfully!'
      })
    )
    .catch(err => res.status(400).json(err));
};

export default UserController;
