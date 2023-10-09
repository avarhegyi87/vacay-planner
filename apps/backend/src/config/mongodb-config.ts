import mongoose, { ConnectOptions } from 'mongoose';

const options: ConnectOptions = {
  dbName: 'vacay-planner',
  user: 'admin',
  pass: 'password',
};

mongoose.connect('mongodb://localhost:27017/vacay-planner', options);

const mongodbConn = mongoose.connection;

mongodbConn.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
mongodbConn.once('open', () => {
  console.log('Connected to MongoDB');
});
