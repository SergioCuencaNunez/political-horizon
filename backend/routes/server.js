const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
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
  const { username, email, password, politicalLeaning } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO users (username, email, password, political_leaning, role) VALUES (?, ?, ?, ?, 'user')";

  db.run(query, [username, email, hashedPassword, politicalLeaning], function (err) {
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
app.post("/account-update", verifyToken, (req, res) => {g
  const { name, email, politicalLeaning } = req.body;
  
  if (!name || !email || !politicalLeaning) {
    return res.status(400).json({ error: "Name, email and political leaning are required." });
  }

  const query = "UPDATE users SET username = ?, email = ?, political_leaning = ? WHERE id = ?";
  db.run(query, [name, email, politicalLeaning, req.user.id], function (err) {
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
  const query = "SELECT username, email, political_leaning FROM users WHERE id = ?";
  db.get(query, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ username: user.username, email: user.email, political_leaning: user.political_leaning });
  });
});

// Check user status for recommendations (new or returning)
app.get("/user/status", verifyToken, (req, res) => {
  const query = `
    SELECT COUNT(*) AS count FROM user_recommendations WHERE user_id = ?;
  `;

  db.get(query, [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to check user status" });

    if (row.count === 0) {
      res.json({ status: "new" });
    } else {
      res.json({ status: "returning" });
    }
  });
});

// Store user interactions with articles
app.post("/user/interactions", verifyToken, (req, res) => {
  const { id, interaction_type, read_time_seconds } = req.body;

  if (!id || !interaction_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO user_interactions (id, user_id, interaction_type, read_time_seconds) 
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [id, req.user.id, interaction_type, read_time_seconds || 0], function (err) {
    if (err) return res.status(500).json({ error: "Failed to store interaction" });
    res.json({ success: true, message: "Interaction stored", interaction_id: this.lastID });
  });
});

// Fetch user interactions along with recommendations and interacted news details
app.get("/user/interactions", verifyToken, (req, res) => {
  const interactionsQuery = `
    SELECT * FROM user_interactions 
    WHERE user_id = ? 
    ORDER BY interaction_timestamp DESC;
  `;

  db.all(interactionsQuery, [req.user.id], (err, interactions) => {
    if (err) return res.status(500).json({ error: "Failed to fetch interactions" });

    if (interactions.length === 0) return res.json([]);

    const interactionNewsIds = interactions.map((interaction) => interaction.id);
    const placeholders = interactionNewsIds.map(() => "?").join(",");

    const newsQuery = `
      SELECT id, headline, outlet, url 
      FROM news_articles 
      WHERE id IN (${placeholders});
    `;

    db.all(newsQuery, interactionNewsIds, (err, newsData) => {
      if (err) return res.status(500).json({ error: "Failed to fetch interacted news details" });

      const newsMap = {};
      newsData.forEach((news) => {
        newsMap[news.id] = { headline: news.headline, outlet: news.outlet, url: news.url };
      });

      const recommendationsQuery = `
        SELECT * FROM user_recommendations
        WHERE user_id = ? AND source_article_id IN (${placeholders})
        ORDER BY source_article_id, date_publish DESC;
      `;

      db.all(recommendationsQuery, [req.user.id, ...interactionNewsIds], (err, allRecommendations) => {
        if (err) return res.status(500).json({ error: "Failed to fetch recommendations" });

        const grouped = {};
        allRecommendations.forEach((rec) => {
          if (!grouped[rec.source_article_id]) grouped[rec.source_article_id] = [];
          grouped[rec.source_article_id].push(rec);
        });

        const result = interactions.map((interaction) => ({
          ...interaction,
          headline: newsMap[interaction.id]?.headline || "Unknown Article",
          outlet: newsMap[interaction.id]?.outlet || "Unknown Outlet",
          url: newsMap[interaction.id]?.url || "#",
          recommendations: (grouped[interaction.id] || []).slice(0, 5),
        }));

        res.json(result);
      });
    });
  });
});

const resetInteractionsSequence = () => {
  const query = `
    UPDATE sqlite_sequence
    SET seq = (SELECT MAX(id) FROM user_interactions)
    WHERE name = 'user_interactions';
  `;

  db.run(query, (err) => {
    if (err) {
      console.error("Failed to reset user interactions sequence:", err.message);
    } else {
      console.log("Sequence reset successfully for user interactions.");
    }
  });
};

// Delete user interaction and associated recommendations
app.delete("/user/interactions/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  // Delete recommendations linked to this interaction
  const deleteRecommendationsQuery = "DELETE FROM user_recommendations WHERE source_article_id = ? AND user_id = ?";
  
  db.run(deleteRecommendationsQuery, [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete recommendations" });

    // Delete the interaction itself
    const deleteInteractionQuery = "DELETE FROM user_interactions WHERE id = ? AND user_id = ?";
    db.run(deleteInteractionQuery, [id, req.user.id], function (err) {
      if (err) return res.status(500).json({ error: "Failed to delete interaction" });

      if (this.changes === 0) {
        return res.status(404).json({ error: "Interaction not found or not authorized" });
      }

      resetInteractionsSequence(); // Reset sequence after deletion
      res.status(204).send();
    });
  });
});

// Fetch 10 random articles if the user is new
app.get("/articles/random", verifyToken, (req, res) => {
  const userQuery = `SELECT political_leaning FROM users WHERE id = ?`;

  db.get(userQuery, [req.user.id], (err, userRow) => {
    if (err || !userRow) return res.status(500).json({ error: "Failed to retrieve user leaning" });

    const userLeaning = userRow.political_leaning.toUpperCase();

    // Define opposite leanings
    let oppositeLeanings = [];
    if (userLeaning === "LEFT") oppositeLeanings = ["CENTER", "RIGHT"];
    if (userLeaning === "RIGHT") oppositeLeanings = ["CENTER", "LEFT"];
    if (userLeaning === "CENTER") oppositeLeanings = ["LEFT", "RIGHT"];

    // Query to get 6 articles from user's leaning
    const queryMain = `
      SELECT * FROM news_articles 
      WHERE political_leaning = ?
      ORDER BY RANDOM()
      LIMIT 6;
    `;

    // Query to get 2 articles from each opposite leaning
    const queryOpposite1 = `
      SELECT * FROM news_articles 
      WHERE political_leaning = ?
      ORDER BY RANDOM()
      LIMIT 2;
    `;

    const queryOpposite2 = `
      SELECT * FROM news_articles 
      WHERE political_leaning = ?
      ORDER BY RANDOM()
      LIMIT 2;
    `;

    db.all(queryMain, [userLeaning], (err1, mainArticles) => {
      if (err1) return res.status(500).json({ error: "Failed to fetch main articles" });

      db.all(queryOpposite1, [oppositeLeanings[0]], (err2, opp1Articles) => {
        if (err2) return res.status(500).json({ error: "Failed to fetch opposite articles" });

        db.all(queryOpposite2, [oppositeLeanings[1]], (err3, opp2Articles) => {
          if (err3) return res.status(500).json({ error: "Failed to fetch opposite articles" });

          // Combine all articles into one response
          const finalArticles = [...mainArticles, ...opp1Articles, ...opp2Articles];

          // Shuffle to avoid strict ordering
          finalArticles.sort(() => Math.random() - 0.5);

          res.json(finalArticles);
        });
      });
    });
  });
});

// Fetch stored recommendations for returning users
app.get("/articles/recommended", verifyToken, (req, res) => {
  const query = `
    SELECT * FROM user_recommendations 
    WHERE user_id = ? AND interaction_type IN ('like', 'read')
    ORDER BY date_publish DESC;
  `;

  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch recommendations" });
    res.json(rows);
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