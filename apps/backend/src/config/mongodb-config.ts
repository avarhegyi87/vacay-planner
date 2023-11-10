import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI!);

const mongodbConn = mongoose.connection;

mongodbConn.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
mongodbConn.once('open', () => {
  console.info('Connected to MongoDB');
});
