import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: { type: String, },
  address: { type: String },
  bills: { type: Object },
  totalArrivals: { type: Number, default: 0 },
  totalAmountBought: { type: Number, default: 0 },
});

const personalInfoSchema = new mongoose.Schema({
  shopName: { type: String },
  gender: { type: String },
  streetAddress: { type: String },
  district: { type: String },
  state: { type: String },
  pinCode: { type: String, trim: true },
  email: { type: String },
  phoneNo: { type: String },
  instagram: { type: String },
}, { _id: false });

const statisticSchema = new mongoose.Schema({
  calenderSales: { type: Object },
  salesTimings: { type: Object },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
email: {
  type: String, required: true, unique: true, lowercase: true, trim: true},
  password: { type: String, required: true },
  vendorSalesId: { type: Number, unique: true },
  personalInfo: personalInfoSchema,
  customers: [customerSchema],
  salesStatistics: statisticSchema,
  myItems: [{ type: String }],
  history: { type: Object },
  functions: {type: Object},
},  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);
export default Users;