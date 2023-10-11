import mongoose, { ConnectOptions } from 'mongoose';
import keys from '../keys/keys';

const options: ConnectOptions = {
  dbName: 'vacay-planner',
  user: 'admin',
  pass: 'password',
};

mongoose.connect(keys.mongoURI!, options);

const mongodbConn = mongoose.connection;

mongodbConn.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
mongodbConn.once('open', () => {
  console.log('Connected to MongoDB');
});
