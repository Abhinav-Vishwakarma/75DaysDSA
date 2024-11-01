import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bodyParser from "body-parser";
import session from "express-session";
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import multer from 'multer';
import { google } from 'googleapis';
import { readFileSync } from "fs";
import { Stream } from "stream";


dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET, // Use a secret from your .env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM credential WHERE username = ?', [username]);
      if (rows.length === 0) return done(null, false, { message: 'Incorrect username.' });

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

      return done(null, { id: user.id, username: user.username });
    } catch (error) {
      return done(error);
    }
  }
));

// Middleware to check if user is already logged in
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If user is authenticated, send a response that they are already logged in
    return res.json({ message: 'You are already logged in.' });
  }
  next(); // Continue to login if not logged in
}

// Login route with login check middleware
app.post('/login', checkLoggedIn, passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/fail',
}));

// Success route
app.get('/success', (req, res) => {
  res.json({ message: 'Login successful!', user: req.user });
});

// Failure route
app.get('/fail', (req, res) => {
  res.json({ message: 'Login failed.' });
});


// Logout route
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return res.status(500).json({ message: 'Logout failed' }); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clears the session cookie
      res.json({ message: 'Logout successful!' });
    });
  });
});

// Setup multer for file uploads

const upload = multer({ storage: multer.memoryStorage() });
// Initialize Google Drive API
// Google Drive API setup
const auth = new google.auth.GoogleAuth({
  // credentials: JSON.parse(readFileSync('path/to/your-service-account-file.json', 'utf-8')),
  keyFile: 'service.json', // Path to your service account JSON key file
  scopes: ['https://www.googleapis.com/auth/drive.file'], // Specify the scope for file uploads
});
const drive = google.drive({ version: 'v3', auth });

// Upload profile image route
app.post('/upload-profile', upload.single('profileImage'), async (req, res) => {
  try {
    const { buffer, originalname, mimetype } = req.file;
    console.log('Uploaded file:', req.file);
    const fileMetadata = {
      name: originalname,
      parents: ['14kQFYTCL4gMPanGWbRHanYx5yfvmKyba'], // Optional: specify a folder ID if needed
    };
    const media = {
      mimeType: mimetype,
      body: new Stream.PassThrough().end(buffer),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log(file.data.id);
    // Optionally, save the file ID to your database
    // const fileId = file.data.id;
    // await db.query('INSERT INTO your_table (file_id) VALUES (?)', [fileId]);

    res.status(200).json({ message: 'File uploaded successfully', fileId: file.data.id });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});




// Serialize user
passport.serializeUser((user, done) => {
  done(null, { id: user.id, username: user.username });
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
