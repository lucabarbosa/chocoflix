import mongoose from 'mongoose';

mongoose.Promise = Promise;

const mongodbUrl =
  process.env.MONGODB_URL ||
  'mongodb://admin:Lucas1997@ds155714.mlab.com:55714/chocoflix';

const connect = () =>
  mongoose.connect(mongodbUrl, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
  });

export default {
  connect
};
