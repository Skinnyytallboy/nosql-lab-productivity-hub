const mongoose = require('mongoose');

const connectDB = async (uri) => {
  const connectionUri = uri || process.env.MONGODB_URI;
  await mongoose.connect(connectionUri);
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
