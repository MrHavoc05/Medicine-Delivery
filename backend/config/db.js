import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('After Creating Cluster on Mongo Db you will find and URL Paste Here That URL').then(() =>console.log('MongoDB connected successfully'));
    
}