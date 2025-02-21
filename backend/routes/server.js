const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5002;
const SECRET_KEY = "secret_key"; // Replace with strong key in production

//app.use(cors());

// For development only
app.use(cors({ origin: "*" }));

/*
// For production
const allowedOrigins = [
  "https://your-frontend-domain.com", // Replace with your frontend's domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
*/

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("../db/database.db", (err) => {
  if (err) console.error("Database connection failed:", err.message);
  else console.log("Connected to SQLite database");
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  });
});

// Check if Email Exists for Login
app.get("/check-login-email", (req, res) => {
  const { email } = req.query;
  const query = "SELECT * FROM users WHERE email = ?";
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) {
      return res.status(404).json({ message: "User not registered. Redirecting to Sign Up..." });
    }
    res.json({ exists: true });
  });
});

// Sign Up Route
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";

  db.run(query, [username, email, hashedPassword], function (err) {
    if (err) return res.status(400).json({ error: "User already exists" });

    // Generate a JWT for the new user
    const token = jwt.sign({ id: this.lastID, role: 'user' }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token, // Include the token in the response
    });
  });
});

// Check Email Route
app.get("/check-email", (req, res) => {
  const { email } = req.query;
  const query = "SELECT * FROM users WHERE email = ?";
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ exists: !!user });
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

// Update User Info Endpoint
app.post("/account-update", verifyToken, (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const query = "UPDATE users SET username = ?, email = ? WHERE id = ?";
  db.run(query, [name, email, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to update profile." });
    res.json({ message: "Profile updated successfully." });
  });
});

// Reset Password Endpoint
app.post("/reset-password", verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old and new passwords are required." });
  }

  const getUserQuery = "SELECT * FROM users WHERE id = ?";
  db.get(getUserQuery, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ error: "Old password is incorrect." });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE id = ?";
    db.run(updatePasswordQuery, [hashedPassword, req.user.id], function (err) {
      if (err) return res.status(500).json({ error: "Failed to reset password." });
      res.json({ message: "Password reset successfully." });
    });
  });
});

// Delete Account Endpoint
app.delete("/delete-account", verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = "DELETE FROM users WHERE id = ?";
  db.run(query, [userId], function (err) {
    if (err) {
      console.error("Error deleting account:", err.message);
      return res.status(500).json({ error: "Failed to delete account." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Account not found." });
    }

    const deleteClaims = "DELETE FROM claims WHERE user_id = ?";
    const deleteDetections = "DELETE FROM detections WHERE user_id = ?";
    db.run(deleteClaims, [userId], (err) => {
      if (err) console.error("Failed to delete claims:", err.message);
    });
    db.run(deleteDetections, [userId], (err) => {
      if (err) console.error("Failed to delete detections:", err.message);
    });

    res.status(200).json({ message: "Account deleted successfully." });
  });
});

// Protected Route
app.get("/profile", verifyToken, (req, res) => {
  const query = "SELECT username, email FROM users WHERE id = ?";
  db.get(query, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ username: user.username, email: user.email });
  });
});

// Get all detections for a user
app.get("/detections", verifyToken, (req, res) => {
  const query = `
  SELECT * 
  FROM detections 
  WHERE user_id = ? 
  ORDER BY date DESC
`;

  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch detections" });
    const parsedRows = rows.map((row) => ({
      ...row,
      models: JSON.parse(row.models),
      true_probabilities: JSON.parse(row.true_probabilities),
      fake_probabilities: JSON.parse(row.fake_probabilities),
      predictions: JSON.parse(row.predictions),
    }));

    res.json(parsedRows);
  });
});

// Get detection by ID
app.get("/detections/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM detections WHERE id = ? AND user_id = ?";
  db.get(query, [id, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to fetch detection" });

    if (!row) {
      return res.status(404).json({ error: "Detection not found" });
    }

    // Parse JSON fields before sending the response
    const parsedRow = {
      ...row,
      models: JSON.parse(row.models),
      true_probabilities: JSON.parse(row.true_probabilities),
      fake_probabilities: JSON.parse(row.fake_probabilities),
      predictions: JSON.parse(row.predictions),
    };

    res.json(parsedRow);
  });
});

// Generate FactGuard Detect ID
const generateDetectionsID = () => {
  const randomNumber = Math.floor(Math.random() * 100);
  const formattedNumber = String(randomNumber).padStart(2, '0');
  return `FGD${formattedNumber}`;
};

// Add a new detection
app.post("/detections", verifyToken, (req, res) => {
  const { title, content, models, confidence, true_probabilities, fake_probabilities, predictions, final_prediction, date } = req.body;

  if (!title || !content || !models || !confidence || !true_probabilities || !fake_probabilities || !predictions || !final_prediction || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const customID = generateDetectionsID();

  const insertQuery = `
    INSERT INTO detections (id, user_id, title, content, models, confidence, true_probabilities, fake_probabilities, predictions, final_prediction, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const checkQuery = "SELECT 1 FROM detections WHERE user_id = ? AND title = ? AND content = ?";

  db.get(checkQuery, [req.user.id, title, content], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (row) {
      return res.status(409).json({ error: "Duplicate detection. Already exists." });
    }

    db.run(
      insertQuery,
      [
        customID, 
        req.user.id, 
        title, 
        content, 
        JSON.stringify(models),
        confidence,
        JSON.stringify(true_probabilities), 
        JSON.stringify(fake_probabilities), 
        JSON.stringify(predictions), 
        final_prediction, 
        date,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: "Failed to add detection" });

        res.status(201).json({
          id: customID,
          user_id: req.user.id,
          title,
          content,
          models,
          confidence,
          true_probabilities,
          fake_probabilities,
          predictions,
          final_prediction,
          date,
        });
      }
    );
  });
});

const resetDetectionsSequence = () => {
  const query = `
    UPDATE sqlite_sequence
    SET seq = (SELECT MAX(id) FROM detections)
    WHERE name = 'detections';
  `;

  db.run(query, (err) => {
    if (err) {
      console.error("Failed to reset detections sequence:", err.message);
    } else {
      console.log("Sequence reset successfully for detections.");
    }
  });
};

// Delete a detection
app.delete("/detections/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM detections WHERE id = ? AND user_id = ?";
  db.run(query, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete detection" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Detection not found or not authorized" });

    resetDetectionsSequence(); // Reset sequence after deletion
    res.status(204).send();
  });
});

// Get all claims for a user
app.get("/claims", verifyToken, (req, res) => {
  const query = `
    SELECT id, query, claims, ratings, links, language, date 
    FROM claims 
    WHERE user_id = ? 
    ORDER BY date DESC
  `;

  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch claims." });

    const parsedRows = rows.map((row) => ({
      ...row,
      claims: JSON.parse(row.claims),
      ratings: JSON.parse(row.ratings),
      links: JSON.parse(row.links),
    }));

    res.json(parsedRows);
  });
});

// Get detection by ID
app.get("/claims/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM claims WHERE id = ? AND user_id = ?";
  db.get(query, [id, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to fetch claim" });

    if (!row) {
      return res.status(404).json({ error: "Claim not found" });
    }

    // Parse JSON fields before sending the response
    const parsedRow = {
      ...row,
      claims: JSON.parse(row.claims),
      ratings: JSON.parse(row.ratings),
      links: JSON.parse(row.links),
    };

    res.json(parsedRow);
  });
});

// Generate a FactGuard Verify ID
const generateClaimsID = () => {
  const randomNumber = Math.floor(Math.random() * 100);
  const formattedNumber = String(randomNumber).padStart(2, '0');
  return `FGV${formattedNumber}`;
};

// Add a new claim
app.post("/claims", verifyToken, (req, res) => {
  const { query, claims, ratings, links, language, date } = req.body;

  if (!query || !claims || !ratings || !links || !language || !date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (claims.length > 3 || ratings.length > 3 || links.length > 3) {
    return res.status(400).json({ error: "A maximum of 3 claims, ratings, and links are allowed per query." });
  }

  const customID = generateClaimsID();

  const insertQuery = `
    INSERT INTO claims (id, user_id, query, claims, ratings, links, language, date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const checkQuery = `
    SELECT 1 FROM claims WHERE user_id = ? AND query = ?
  `;

  db.get(checkQuery, [req.user.id, query], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (row) {
      return res.status(409).json({ error: "Duplicate query. Already exists." });
    }

    db.run(
      insertQuery,
      [
        customID,
        req.user.id,
        query,
        JSON.stringify(claims),
        JSON.stringify(ratings),
        JSON.stringify(links),
        language,
        date,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: "Failed to add claims." });

        res.status(201).json({
          id: customID,
          query,
          claims,
          ratings,
          links,
          language,
          date,
        });
      }
    );
  });
});

const resetClaimsSequence = () => {
  const query = `
    UPDATE sqlite_sequence
    SET seq = (SELECT MAX(id) FROM claims)
    WHERE name = 'claims';
  `;

  db.run(query, (err) => {
    if (err) {
      console.error("Failed to reset claims sequence:", err.message);
    } else {
      console.log("Sequence reset successfully for claims.");
    }
  });
};

// Delete a claim
app.delete("/claims/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM claims WHERE id = ? AND user_id = ?";
  db.run(query, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete claim" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Claim not found or not authorized" });

    resetClaimsSequence(); // Reset sequence after deletion
    res.status(204).send();
  });
});

/*
// For development only
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/

// For deployment
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});