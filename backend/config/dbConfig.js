import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coderwing_ecommerce';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
