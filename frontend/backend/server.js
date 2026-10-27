require("dotenv").config();

const Employee = require("./models/Employee");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Company = require("./models/Company");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", decoded.id, decoded.role);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


// Home route
app.get("/", (req, res) => {
  res.send("HCM Lite backend is running!");
});

// First-time Admin and Company Setup
app.post("/api/setup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      companyEmail,
      address,
      setupSecret,
    } = req.body;

    if (!process.env.SETUP_SECRET ||
        setupSecret !== process.env.SETUP_SECRET) {
      return res.status(403).json({
        message: "Invalid setup secret",
      });
    }

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        message: "Name, email, password and company name are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Do not create another initial Admin.
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(403).json({
        message: "Admin setup is already complete",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    try {
      const company = await Company.create({
        name: companyName.trim(),
        email: companyEmail
          ? companyEmail.trim().toLowerCase()
          : undefined,
        address: address ? address.trim() : undefined,
        createdBy: admin._id,
      });

      admin.companyId = company._id;
      await admin.save();

      const token = jwt.sign(
        {
          id: admin._id.toString(),
          role: "admin",
          companyId: company._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(201).json({
        message: "Admin and company setup successful!",
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          companyId: company._id,
        },
        company: {
          id: company._id,
          name: company.name,
        },
      });
    } catch (error) {
      // Roll back the Admin if company creation fails.
      await User.deleteOne({ _id: admin._id });
      throw error;
    }
  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      message: "Setup failed",
    });
  }
});

// Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Public signup can never choose the Admin or HR role.
    // The User model's default role is employee.
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "employee",
    });

    await newUser.save();

    return res.status(201).json({
      message: "Signup successful!",
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      message: "Signup failed",
    });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from backend .env");

      return res.status(500).json({
        message: "Server authentication is not configured",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        companyId: user.companyId
          ? user.companyId.toString()
          : null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});


app.post("/api/employees", verifyToken, async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only Admin or HR can add employees",
      });
    }

    const { name, email, department, position, salary } = req.body;

    if (
      !name || !email || !department ||
      !position || salary === undefined || salary === null || salary === ""
    ) {
      return res.status(400).json({
        message: "Please fill all employee fields",
      });
    }

    if (!Number.isFinite(Number(salary)) || Number(salary) < 0) {
      return res.status(400).json({
        message: "Salary must be a valid non-negative number",
      });
    }

    if (!req.user.companyId) {
      return res.status(400).json({
        message: "Your account is not linked to a company",
      });
    }

    const employee = await Employee.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      position: position.trim(),
      salary: Number(salary),
      companyId: req.user.companyId,
    });

    return res.status(201).json({
      message: "Employee added successfully!",
      employee,
    });
  } catch (error) {
    console.error("Add employee error:", error.message);

    return res.status(500).json({
      message: "Failed to add employee",
    });
  }
});

// Gemini AI Assistant
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a question",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are HCM Lite, a helpful HR management assistant.
Help users with employee management, attendance, leave policies, and payroll.
Only use information provided in the conversation. Never claim to have accessed company records unless they were actually provided.

User question: ${message}`,
    });

    res.json({
      reply: response.text || "Sorry, I could not generate a response.",
    });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      message: "AI assistant could not respond. Please try again.",
    });
  }
});

// Start backend after connecting to MongoDB
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    app.listen(5000, () => {
      console.log("HCM Lite backend is running on port 5000");
    });
  } catch (error) {
    console.error("Backend startup error:", error.message);
  }
}

startServer();