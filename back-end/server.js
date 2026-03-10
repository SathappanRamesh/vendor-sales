import express from "express"
import cors from "cors"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Users from "./models/Users.js"
import twilio from "twilio";
import PDFDocument from "pdfkit";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import {nanoid} from 'nanoid';
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import TemporaryUsersModel from "./models/TemporaryUsers.js";

const app = express();
const PORT = process.env.PORT || 3000;
let DB_URL = process.env.DB_URL
const SECRET_KEY  = process.env.SECRET_KEY;
// Cloudinary Credentials
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// Twilio Credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://iridescent-chaja-88ab25.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

mongoose.connect(DB_URL, {
    family: 4,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);

    req.user = {
      username: decodedToken.username,
      userId: decodedToken.userId,
      email: decodedToken.email,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post('/register', async (req, res) => {
    const { user } = req.body;
    
    const username = user.username;
    const email = user.email;
    const password = user.password;
    try {

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExist = await Users.findOne({email});
    if (isUserExist) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
        const token = generateVerificationPin();

    // Save user details in temporary collection
        let vendorSalseId = nanoid(6);
    const temporaryUser = new TemporaryUsersModel({
      username,
      email,
      password: hashedPassword,
      fourDigitCode: token,
      vendorSalseId
    });
    await temporaryUser.save();
    res.status(201).json({ message: "User registered successfully", token, email });

    sendEmail(email, token);
        } catch (error) {
        console.log("Error during registration:", error);
        res.status(500).json({ message: "Error during registration", error });
    }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update guide flag
    await Users.updateOne(
      { email },
      { $set: { "functions.showGuide": true } }
    );

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, SECRET_KEY, { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token});

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

app.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const temporaryUser = await TemporaryUsersModel.findOne({ email: email, fourDigitCode: code });
    console.log(temporaryUser);
    
    if (temporaryUser) {
      const newUser = new Users({
        username: temporaryUser.username,
        email: temporaryUser.email,
        password: temporaryUser.password,
        vendorSalseId: temporaryUser.vendorSalseId,
        registered: true,
        deviceRegistered: true,
      });

      await newUser.save();
      await TemporaryUsersModel.deleteOne({ email, fourDigitCode: code });

      res.status(200).json({ success: true, message: 'Verification successful!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/send-bill-to-customer", async (req, res) => {
  try {

    function generateTablePDF(filename, tableData, otherBillDetails) {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filename);
      doc.pipe(writeStream);

      const columnWidth = 100;
      const rowHeight = 28;
      const tableX = 50;
      let y = 140;

      // shop title
      doc.fontSize(22).font("Helvetica-Bold")
        .text("ABC GROCERIES", { align: "center" });

      const pageWidth = doc.page.width;
      const margin = 50;

      // bill details
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("NAME: RAMASWAMY", margin, 80);

      let dateText = "DATE: 12/1/2023";
      let dateWidth = doc.widthOfString(dateText);
      doc.text(dateText, pageWidth - margin - dateWidth, 80);

      doc.text("BILL NO: 12D837FHJFD78K34J", margin, 105);

      let timeText = "TIME: 3:48 PM";
      let timeWidth = doc.widthOfString(timeText);
      doc.text(timeText, pageWidth - margin - timeWidth, 105);

      // table header
      const columns = ["no", "name", "price", "qty", "amount"];
      doc.fontSize(12).font("Helvetica-Bold");

      columns.forEach((col, i) => {
        const x = tableX + i * columnWidth;
        doc.rect(x, y, columnWidth, rowHeight).fillAndStroke("#e0e0e0", "#000");
        doc.fill("#000").text(col.toUpperCase(), x + 10, y + 8);
      });

      y += rowHeight;
      doc.font("Helvetica").fontSize(12);

      tableData.forEach((row, index) => {
        const isLastRow = index === tableData.length - 1;

        columns.forEach((col, i) => {
          const x = tableX + i * columnWidth;
          let fillColor = index % 2 ? "#f9f9f9" : "#ffffff";
          if (isLastRow) fillColor = "#d4ffd4";

          doc.rect(x, y, columnWidth, rowHeight)
            .fillAndStroke(fillColor, "#000");

          let text = row[col] !== undefined ? String(row[col]) : "";
          doc.fill("#000").text(text, x + 10, y + 8);
        });

        y += rowHeight;
      });

      doc.end();

      return new Promise((resolve, reject) => {
        writeStream.on("finish", () => resolve(filename));
        writeStream.on("error", reject);
      });
    }

    const tableData = [
      { no: 1, name: "Apple", price: 50, qty: 3, amount: 150 },
      { no: 2, name: "Banana", price: 20, qty: 10, amount: 200 },
      { no: 3, name: "Milk", price: 40, qty: 2, amount: 80 },
      { no: "", name: "TOTAL", price: "", qty: "", amount: 430 }
    ];

    const pdfPath = await generateTablePDF("table.pdf", tableData);

    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      format: "pdf",
      use_filename: true,
      unique_filename: false,
        resource_type: "raw",
  type: "upload",
  access_mode: "public",
    });
    
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+919159053487",
      body: "📄 Your grocery bill is ready",
      mediaUrl: [uploadResult.secure_url]
    });

    res.json({
      success: true,
      message: "PDF Generated & Sent to WhatsApp",
      cloud_url: uploadResult.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF Generation Error", error });
  }
});


app.post("/send-bill", authenticateUser, async (req, res) => {
    const {data} = req.body;
    
      const userId = req.user.userId;
    try {
       const year = new Date().getFullYear(), month = new Date().toLocaleString('en-IN', { month: 'long' }), date = new Date().getDate();
      const time = new Date().toLocaleTimeString();
      const user = await Users.findOne({_id: userId});

      let isCustomerExist = user.customers.findIndex((prev) => {
        return prev?.phoneNo == data.customerData.phoneNo
      }) 
      
      if ( isCustomerExist !== -1) {// If customer exists
        let index = isCustomerExist;
        let currentBillData = data.bill;
        await Users.updateOne(
          { _id: userId },
          {
            // Adding bill to existing customer
            $push: {
              [`customers.${index}.bills.${year}.${month}.${date}`]: currentBillData
            },
            $push: {
              [`.history`]: {
                bill: currentBillData,
                date: `${date}-${month}-${year}`,
                time: data.bill.time,
                totalAmountBought: data.bill.totalAmount,
                billUrl: "https://res.cloudinary.com/dv4t3wqzj/raw/upload/v1701367377/table.pdf",
              }
            },
            // Storing total arrivals and total amount bought by customer
            $inc: {
              [`customers.${index}.totalArrivals`]: 1,
              [`customers.${index}.totalAmountBought`]: data.bill.totalAmount
            }
          }
        );
      } else {    // If customer does not exist    
        console.log("user doen not");
        let currentBillData = data.bill;
        user.customers.push({
          name: data.customerData.name,
          phoneNo: data.customerData.phoneNo,
          bills: {[year]: {
            [month]: {
              [date]: [currentBillData]
            }
          }},
          totalAmountBought: data.bill.totalAmount,
          totalArrivals: 1
        })
      }

      let totalAmount = data.bill.totalAmount;
      await Users.updateOne(
        { _id: userId },
        {
              $inc: {
            [`salesStatistics.calenderSales.${year}.${month}.${date}`]: totalAmount,
            [`salesStatistics.calenderSales.${year}.thisYearTotalAmount`]: totalAmount,
            [`salesStatistics.calenderSales.${year}.${month}.thisMonthTotalAmount`]: totalAmount
          }
        }
      );
      //
        let splitTime = time.split(":");
        let isAmOrPm = time.slice(time.length-2, time.length);
        let editedTime = `${splitTime[0]}-${"am"}`;
            await Users.updateOne(
        { _id: userId },
        {
          $inc: {
            [`salesStatistics.salesTimings.${editedTime}`]: 1
          }
        }
      );
// ------------------------------- Send Bill To WhatsApp-------------------------------------------
    function generateTablePDF(filename, tableData) {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filename);
      doc.pipe(writeStream);

      const columnWidth = 100;
      const rowHeight = 28;
      const tableX = 50;
      let y = 140;

      // shop title
      doc.fontSize(22).font("Helvetica-Bold")
        .text(`${otherBillDetails.shopName.toUpperCase()}`, { align: "center" });

      const pageWidth = doc.page.width;
      const margin = 50;

      // bill details
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text(`NAME: ${otherBillDetails.toName.toUpperCase()}`, margin, 80);

      let dateText = `DATE: ${otherBillDetails.date}`;
      let dateWidth = doc.widthOfString(dateText);
      doc.text(dateText, pageWidth - margin - dateWidth, 80);

      doc.text(`BILL NO: ${otherBillDetails.billNo}`, margin, 105);

      let timeText = `TIME: ${otherBillDetails.time}`;
      let timeWidth = doc.widthOfString(timeText);
      doc.text(timeText, pageWidth - margin - timeWidth, 105);

      // table header
      const columns = ["no", "name", "price", "qty", "amount"];
      doc.fontSize(12).font("Helvetica-Bold");

      columns.forEach((col, i) => {
        const x = tableX + i * columnWidth;
        doc.rect(x, y, columnWidth, rowHeight).fillAndStroke("#e0e0e0", "#000");
        doc.fill("#000").text(col.toUpperCase(), x + 10, y + 8);
      });

      y += rowHeight;
      doc.font("Helvetica").fontSize(12);

      tableData.forEach((row, index) => {
        const isLastRow = index === tableData.length - 1;

        columns.forEach((col, i) => {
          const x = tableX + i * columnWidth;
          let fillColor = index % 2 ? "#f9f9f9" : "#ffffff";
          if (isLastRow) fillColor = "#d4ffd4";

          doc.rect(x, y, columnWidth, rowHeight)
            .fillAndStroke(fillColor, "#000");

          let text = row[col] !== undefined ? String(row[col]) : "";
          doc.fill("#000").text(text, x + 10, y + 8);
        });

        y += rowHeight;
      });

      doc.end();

      return new Promise((resolve, reject) => {
        writeStream.on("finish", () => resolve(filename));
        writeStream.on("error", reject);
      });
    }

    const tableData = [];

    let shopName = user.personalInfo?.shopName || "SHOP NAME";
    let billNo = data.bill.billId;
    let toName = data.customerData.name || "CUSTOMER NAME";
    let billDate = data.bill.date || "DATE";
    let billTime = data.bill.time || "TIME";
        const otherBillDetails = {
      shopName,
      date: billDate,
      time: billTime,
      billNo,
      toName,
    };

for (const key in data.bill) {
  if (!Number.isInteger(+key)) continue;

  const item = data.bill[key];

  tableData.push({
    no: item.id,
    name: item.name,
    price: item.price,
    qty: item.quantity,
    amount: item.amount,
  });
}
tableData.push({
  no: "",
  name: "TOTAL",
  price: "",
  qty: "",
  amount: data.bill.totalAmount,
});

    const pdfPath = await generateTablePDF("table.pdf", tableData, otherBillDetails);

    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      format: "pdf",
      use_filename: true,
      unique_filename: false,
        resource_type: "raw",
        type: "upload",
        access_mode: "public",
    });
    
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+91${data.customerData.phoneNo}`,
      body: "📄 Your grocery bill is ready",
      mediaUrl: [uploadResult.secure_url]
    });
//
const phone = data.customerData.phoneNo;
const pdfUrl = uploadResult.secure_url;

const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(pdfUrl)}`;
      
            await Users.updateOne(
          { _id: userId },
          {
            $push: {
              [`history`]: {
                name: data.customerData.name,
                bill: data.bill,
                date: `${date}-${month}-${year}`,
                time: data.bill.time,
                totalAmountBought: data.bill.totalAmount,
                billUrl: uploadResult.secure_url,
              }
            },
          }
        );

    res.json({
      success: true,
      message: "PDF Generated & Sent to WhatsApp",
      cloud_url: uploadResult.secure_url,
      whatsappLink
    });
      user.markModified('profile');
      await user.save();
    } catch (error) {
      console.log(error);
    }
});

app.post("/change-user-info", authenticateUser, async (req, res) => {
  const {field, changedData} = req.body;
  console.log(field, changedData);
  
  const userId = req.user.userId;
  try {
  const user = await Users.findOne({_id: userId});  

  await Users.updateOne(
  { _id: userId },
  { $set: { [`personalInfo.${field}`]: changedData } }
);

  await user.save();
  } catch (error) {
    res.status(500).json({error: "Error changing user personal data"})
  }
});

// -------------------------------------- GET METHODS --------------------------------------
app.get("/get-user-data", authenticateUser,  async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await Users.findOne({_id: userId}, { password: 0, email: 0 });  
      res.status(200).json({userData: user});
    } catch (error) {
      res.status(500).json({error: "Error fetching user data"})
    }
});

app.get("/get-user-personal-data", authenticateUser,  async (req, res) => {
    const userId = req.user.userId;    
    try {
const user = await Users.findOne(
  { _id: userId },
  { personalInfo: 1, username: 1, vendorSalesId: 1})
      res.status(200).json({userPersonalInfo: user,});
    } catch (error) {
      res.status(500).json({error: "Error fetching user personal data"})
    }
});

app.post("/close-guide", authenticateUser,  async (req, res) => {
    const userId = req.user.userId;
    try {
        await Users.updateOne(
          { _id: userId },
          { $set: { [`functions.showGuide`]: false } }
        );
              res.status(200).json("Guide Closed");
                await user.save();

    } catch (error) {
      res.status(500).json({error: "Error fetching user history"})
    }
});

app.get("/get-history", authenticateUser,  async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await Users.findOne({_id: userId}, { history: 1, _id: 0 });  
      res.status(200).json({userHistory: user});
    } catch (error) {
      res.status(500).json({error: "Error fetching user history"})
    }
});

app.post("/store-items", authenticateUser, async (req, res) => {
    const { items } = req.body;
    console.log(items);
    
    const userId = req.user.userId;
    try {
      await Users.updateOne(
        { _id: userId },
        { $push: { myItems: { $each: items } } }
      );
      res.status(200).json({ message: "Item stored successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error storing item" });
    }
});

app.get("/get-my-items", authenticateUser, async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await Users.findOne({_id: userId}, { myItems: 1, _id: 0 });  
      console.log(user);
      
      res.status(200).json({ myItems: user.myItems });
    } catch (error) {
      res.status(500).json({ error: "Error fetching items" });
    }
});

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kdsomewhatelse@gmail.com',
    pass: 'drugjvpuwdfzregv',
  },
});

function sendEmail(email, token) {
  const mailOptions = {
    from: 'kdsomewhatelse@gmail.com',
    to: email,
    subject: 'Email verification',
    text: `To join our quiz-ko, verify your email with this 4-digit pin code: ${token}`,
  };
  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function generateVerificationPin() {
  return Math.floor(1000 + Math.random() * 9000);
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
