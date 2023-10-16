import mongoose from 'mongoose';
import keys from '../keys/keys';

mongoose.connect(keys.mongoURI!);

const mongodbConn = mongoose.connection;

mongodbConn.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
mongodbConn.once('open', () => {
  console.info('Connected to MongoDB');
});
