import mongoose from 'mongoose';
import { config } from 'dotenv'
config()

export default async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (error) {
    console.log(error);
  }
}