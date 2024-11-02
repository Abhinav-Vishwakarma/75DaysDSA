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
// import { readFileSync } from "fs";
import { Stream } from "stream";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const allowedOrigins = ['https://75-days-dsa.vercel.app'];

app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true });
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET, // Use a secret from your .env
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
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
      if (rows.length === 0) return done(null, false, { status:false,value:"Username is Incorrect!" });
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, {status:false,value:"Password is Incorrect!"  });
      return done(null, { id: user.id, username: user.username });
    } catch (error) {
      return done(error);
    }
  }
));

// Middleware to check if user is already logged in
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If user is authenticated, send a response indicating they are already logged in
    return res.redirect('https://75-days-dsa.vercel.app/dashboard');

    // return console.log(req.user.id );
    // return res.redirect('https://75-days-dsa.vercel.app/dashboard');
  }
  next(); // Continue to the login route if not logged in
}

app.get('/api/check-auth', (req, res) => {
  console.log("api is called");
  if (req.isAuthenticated()) {
    res.status(200).json({ loggedIn: true, userId: req.user.id });
  } else if (req.cookies.userId) { // Check if the cookie exists
    res.status(200).json({ loggedIn: true, userId: req.cookies.userId }); // Optionally return userId from cookie
  } else {
    res.status(401).json({ loggedIn: false });
  }
});


// Login route with login check middleware
// app.post('/login', checkLoggedIn, (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) { return next(err); }
//     if (!user) {
//       return res.redirect('/fail'); // Redirect if authentication fails
//     }
//     req.logIn(user, (err) => {
//       if (err) { return next(err); }
//       return res.redirect('/success'); // Redirect if login is successful
//     });
//   })(req, res, next);
// });

app.post("/login", passport.authenticate("local", {
  successRedirect: "/success",
  failureRedirect: "/fail",
}));

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       console.error("Authentication error:", err);
//       return res.status(500).send("An error occurred during authentication.");
//     }
    
//     if (!user) {
//       console.log("Login failed:", info.value); 
//       return res.status(401).send(info.value);
//     }

//     req.logIn(user, (loginErr) => {
//       if (loginErr) {
//         console.error("Login error:", loginErr);
//         return res.status(500).send("Login error" );
//       }
//       // Save session before responding
//       req.session.save(() => {
//         return res.send(true); 
//       });
//     });
//   })(req, res, next);
// });





function check_cookie(req,res){
  const userId = req.cookies.userId; 
  if (userId) {
    console.log(userId);
  } else {
    console.log("not found");
  }
}

app.get("/api/authentication", (req, res) => {
  console.log(req.user.id);
  console.log(req.cookies.id);
  if(req.isAuthenticated){
    console.log("Yes");
    return res.send(true);
    
  }else{
    console.log("No");
    return res.send(false);
    
  }
});


// Success route
app.get('/success', (req, res) => {
  // console.log(req.user.id);
  res.cookie('id', req.user.id, {httpOnly: true,secure:false }); 
  res.send(true);
});

// Failure route
app.get('/fail', (req, res) => {
  // res.cookie('id':null, {httpOnly: true,secure:false });
  res.send(false);
 
});


// Logout route
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.send(err );
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.send(err);
      }

      // Clear cookies
      res.clearCookie('connect.sid'); // Clear the session cookie set by express-session
      res.clearCookie('id'); // Clear the custom 'id' cookie if needed
      
      // Send response after cookies are cleared
      res.send(true);
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


app.get('/api/user', async (req, res) => {
  // console.log(req.isAuthenticated());
  if(req.isAuthenticated()){
    try {
      const [results] = await db.query('SELECT * FROM credential WHERE id = ?', [req.cookies.id]);
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});


// app.put('/api/user', async (req, res) => {
//   const { id, field, data } = req.body;
//   try {
//     // Update the specified field for the user with the given id
//     const query = `UPDATE credential SET ${field} = ? WHERE id = ?`;
//     const [updateResult] = await db.query(query, [data, id]);

//     if (updateResult.affectedRows > 0) {
//       // Fetch the updated user data to return to the client
//       const [updatedUser] = await db.query('SELECT * FROM credential WHERE id = ?', [id]);
//       res.json({
//         message: "User data updated successfully",
//         updatedData: updatedUser[0], // Send the updated row back
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (err) {
//     console.error("Error updating user data:", err);
//     res.status(500).send(err);
//   }
// });
app.put('/api/user', async (req, res) => {
  const {...updatedFields } = req.body; // Destructure id and rest of the fields
  try {
    // Create an array of fields to update dynamically
    const fieldsToUpdate = Object.keys(updatedFields);
    const valuesToUpdate = fieldsToUpdate.map(field => updatedFields[field]);

    // Prepare the query string dynamically
    const query = `UPDATE credential SET ${fieldsToUpdate.map(field => `${field} = ?`).join(', ')} WHERE id = ?`;
    
    // Add the id as the last value for the WHERE clause
    console.log(query);
    
    const [updateResult] = await db.query(query, [...valuesToUpdate, req.cookies.id]);

    if (updateResult.affectedRows > 0) {
      // Fetch the updated user data to return to the client
      // const [updatedUser] = await db.query('SELECT * FROM credential WHERE id = ?', [id]);
      // res.json({
      //   message: "User data updated successfully",
      //   updatedData: updatedUser[0], // Send the updated row back
      // });
      res.send({status:true,value:'User data updated successfully!'});
    } else {
      res.send({status:false,value:'User Not Found!'});
    }
  } catch (err) {
    console.error("Error updating user data:", err);
    res.send({status:false,value:'Error updating user data'});
  }
});



// Check username uniqueness
app.get('/check-username', async(req, res) => {
  const { username } = req.query;
  try{
    const [result]=await db.query("select username from credential where username=?",[username]);
    
    if (result.length===0){
      console.log("user not exits");
      return res.send({status:false });
    }else{
      return res.send({ status:true });
    }
  }catch(err){
    console.log(err);
  }
  
});

// Register new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO credential (username, password) VALUES (?, ?)', [username, hashedPassword]);
      res.send(true);
  } catch (error) {
      res.send(false);
      // res.status(500).send('Server Error');
  }
});




passport.serializeUser((user, done) => {
  // console.log('Serializing user:', user); // Check the user object
  done(null, { id: user.id, username: user.username });
});
passport.deserializeUser((user, done) => {
  // console.log('Deserializing user:', user); // Check what is being deserialized
  done(null, user);
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});




