import mongoose from 'mongoose';

const temporaryUsersSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fourDigitCode: String,
  createdAt: { type: Date, default: Date.now, expires: '1h' }
});

const TemporaryUsers = mongoose.model("TemporaryUsersModel", temporaryUsersSchema);
export default TemporaryUsers;