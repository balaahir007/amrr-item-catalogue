const Item = require("../model/Item");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
};

exports.addItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: "Error adding item" });
  }
};

exports.enquireItem = async (req, res) => {
  try {
    const { itemName } = req.body;

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../layout/enquiryEmail.html"),
      "utf8"
    );
    const htmlContent = htmlTemplate.replace("{{ITEM_NAME}}", itemName);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "balaahir007@gmail.com",
      subject: `Enquiry about ${itemName}`,
      html: htmlContent,
    });

    console.log("Email sent:", info.messageId);
    res.json({ success: true, info }); 
  } catch (error) {
    console.error("Error sending enquiry email:", error);
    res.status(500).json({ error: "Error sending enquiry email" });
  }
};
