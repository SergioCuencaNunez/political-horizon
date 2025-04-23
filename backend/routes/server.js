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

    const deleteInteractions = "DELETE FROM user_interactions WHERE user_id = ?";
    const deleteRecommendations = "DELETE FROM user_recommendations WHERE user_id = ?";
    db.run(deleteInteractions, [userId], (err) => {
      if (err) console.error("Failed to delete interactions:", err.message);
    });
    db.run(deleteRecommendations, [userId], (err) => {
      if (err) console.error("Failed to delete recommendations:", err.message);
    });

    res.status(200).json({ message: "Account deleted successfully." });
  });
});

// Protected Route
app.get("/profile", verifyToken, (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ error: "Admins are not allowed to access the user profile route. Please log in as a regular user." });
  }

  const query = "SELECT username, email, political_leaning FROM users WHERE id = ?";
  db.get(query, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ username: user.username, email: user.email, political_leaning: user.political_leaning });
  });
});

// Get all users
app.get("/users", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can view users." });
  }

  const query = `SELECT * FROM users WHERE role = 'user' ORDER BY last_recommendation_timestamp DESC`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users." });
    res.json(rows);
  });
});

app.delete("/users/:id", verifyToken, (req, res) => {
  const userId = req.params.id;

  // Check if the requester is an admin
  if (!req.user || req.user.role !== "admin"){
    return res.status(403).json({ error: "Unauthorized access." });
  }

  const query = "DELETE FROM users WHERE id = ?";
  db.run(query, [userId], function (err) {
    if (err) {
      console.error("Error deleting user:", err.message);
      return res.status(500).json({ error: "Failed to delete user." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const deleteInteractions = "DELETE FROM user_interactions WHERE user_id = ?";
    const deleteRecommendations = "DELETE FROM user_recommendations WHERE user_id = ?";
    db.run(deleteInteractions, [userId], (err) => {
      if (err) console.error("Failed to delete interactions:", err.message);
    });
    db.run(deleteRecommendations, [userId], (err) => {
      if (err) console.error("Failed to delete recommendations:", err.message);
    });

    res.status(200).json({ message: "User deleted successfully." });
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

  const { DateTime } = require("luxon");
  const localTime = DateTime.now().setZone("Europe/Madrid").toFormat("yyyy-MM-dd HH:mm:ss");

  const query = `
    INSERT INTO user_interactions (id, user_id, interaction_type, read_time_seconds, interaction_timestamp) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [id, req.user.id, interaction_type, read_time_seconds || 0, localTime], function (err) {
    if (err) return res.status(500).json({ error: "Failed to store interaction" });
    res.json({ success: true, message: "Interaction stored", interaction_id: this.lastID });
  });
});

// Fetch user interactions along with recommendations and interacted news details
app.get("/user/interactions", verifyToken, (req, res) => {
  const isAdmin = req.user.role === "admin";
  const interactionsQuery = isAdmin
    ? `SELECT * FROM user_interactions ORDER BY interaction_timestamp DESC`
    : `SELECT * FROM user_interactions WHERE user_id = ? ORDER BY interaction_timestamp DESC`;
  
  const params = isAdmin ? [] : [req.user.id];

  db.all(interactionsQuery, params, (err, interactions) => {
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

      const recommendationsQuery = isAdmin
      ? `
        SELECT * FROM user_recommendations
        WHERE source_article_id IN (${placeholders})
        ORDER BY source_article_id, date_publish DESC;
      `
      : `
        SELECT * FROM user_recommendations
        WHERE user_id = ? AND source_article_id IN (${placeholders})
        ORDER BY source_article_id, date_publish DESC;
      `;
      
      const recParams = isAdmin ? interactionNewsIds : [req.user.id, ...interactionNewsIds];
      db.all(recommendationsQuery, recParams, (err, allRecommendations) => {
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

  const isAdmin = req.user.role === "admin";
  const deleteRecommendationsQuery = isAdmin
    ? "DELETE FROM user_recommendations WHERE source_article_id = ?"
    : "DELETE FROM user_recommendations WHERE source_article_id = ? AND user_id = ?";

  const recommendationsParams = isAdmin ? [id] : [id, req.user.id];

  db.run(deleteRecommendationsQuery, recommendationsParams, function (err) {  
    if (err) return res.status(500).json({ error: "Failed to delete recommendations" });

    // Delete the interaction itself
    const deleteInteractionQuery = isAdmin
    ? "DELETE FROM user_interactions WHERE id = ?"
    : "DELETE FROM user_interactions WHERE id = ? AND user_id = ?";

    const interactionsParams = isAdmin ? [id] : [id, req.user.id];
    db.run(deleteInteractionQuery, interactionsParams, function (err) {  
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

    // Query to get 4 articles from user's leaning
    const queryMain = `
      SELECT * FROM news_articles 
      WHERE political_leaning = ?
      ORDER BY RANDOM()
      LIMIT 4;
    `;

    // Query to get 3 articles from each opposite leaning
    const queryOpposite1 = `
      SELECT * FROM news_articles 
      WHERE political_leaning = ?
      ORDER BY RANDOM()
      LIMIT 3;
    `;

    const queryOpposite2 = `
      SELECT * FROM news_articles 
      WHERE political_leaning = ?
      ORDER BY RANDOM()
      LIMIT 3;
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

// Get the user's balance report
app.get("/user/balance-report", verifyToken, (req, res) => {

  const READ_TIME_THRESHOLD = 120;  // Interesting Read
  const FULL_READ_THRESHOLD = 90;   // Fully Read
  const MIN_READ_WEIGHT = 10;       // Minimum value for short reads
  const MAX_READ_WEIGHT = 180;      // Maximum value for long reads
  const LIKE_WEIGHT = READ_TIME_THRESHOLD; // A like is considered a 2-minute read

  const userId = req.user.id;

  const interactionsQuery = `
    SELECT id, read_time_seconds, interaction_type
    FROM user_interactions
    WHERE user_id = ? AND ((interaction_type = 'read') OR interaction_type = 'like')
  `;

  db.all(interactionsQuery, [userId], (err, interactionRows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch user interactions" });

    if (interactionRows.length === 0) {
      return res.json({
        political_leaning: "N/A",
        interactions: { LEFT: 0, CENTER: 0, RIGHT: 0 },
        unique_outlets_read: 0,
        most_frequented_sources: [],
        avg_read_time: { LEFT: "N/A", CENTER: "N/A", RIGHT: "N/A" },
        reading_behavior_message: "No reading data available.",
        shannon_entropy: "N/A",
        kl_divergence: "N/A",
        balance_score: 0,
        balance_message: "Not enough data to determine balance.",
      });
    }

    // Extract article IDs
    const articleIds = interactionRows.map(row => row.id);
    
    // Query to fetch political leaning and outlet info from news_articles
    const articlesQuery = `
      SELECT id, political_leaning, outlet
      FROM news_articles
      WHERE id IN (${articleIds.map(() => "?").join(",")})
    `;

    db.all(articlesQuery, articleIds, (err, articleRows) => {
      if (err) return res.status(500).json({ error: "Failed to fetch article details" });

      const counts = { LEFT: 0, CENTER: 0, RIGHT: 0 };
      const totalReadTime = { LEFT: 0, CENTER: 0, RIGHT: 0 };
      const readCounts = { LEFT: 0, CENTER: 0, RIGHT: 0 };
      const outletsCount = {};
      const outletReadTime = {};
      const outlets = new Set();
      const fullyReadCount = { LEFT: 0, CENTER: 0, RIGHT: 0 };
      const quickReadCount = { LEFT: 0, CENTER: 0, RIGHT: 0 };
      
      // Map articles by ID for quick lookup
      const articleMap = Object.fromEntries(articleRows.map(article => [article.id, article]));

      // Process interactions
      interactionRows.forEach(row => {
        const article = articleMap[row.id];
        if (!article) return;

        const leaning = article.political_leaning;
        const readTime = row.read_time_seconds;
        const interactionType = row.interaction_type;

        // Count read times ONLY for 'read' interactions
        if (interactionType === "read" && readTime > 0) {
          totalReadTime[leaning] += readTime;
          readCounts[leaning] += 1;
          if (readTime >= FULL_READ_THRESHOLD) fullyReadCount[leaning]++;
          else if (readTime < FULL_READ_THRESHOLD) quickReadCount[leaning]++;
        }

        const timeWeight = interactionType === "like"
        ? LIKE_WEIGHT
        : Math.max(MIN_READ_WEIGHT, Math.min(MAX_READ_WEIGHT, readTime || 0));

        if (leaning) counts[leaning] += timeWeight;

        if (article.outlet) {
          outlets.add(article.outlet);
          outletsCount[article.outlet] = (outletsCount[article.outlet] || 0) + timeWeight;
        }

        if (interactionType === "read" && readTime > 0 && article.outlet) {
          outletReadTime[article.outlet] = (outletReadTime[article.outlet] || 0) + readTime;
        }        
      });

      // Smoothing to avoid zero probs
      const epsilon = 1e-10;
      const total = counts.LEFT + counts.CENTER + counts.RIGHT;
      const probs = {
        LEFT: total > 0 ? counts.LEFT / total : epsilon,
        CENTER: total > 0 ? counts.CENTER / total : epsilon,
        RIGHT: total > 0 ? counts.RIGHT / total : epsilon
      };

      // Apply epsilon if any prob is 0
      Object.keys(probs).forEach(key => {
        if (probs[key] === 0) probs[key] = epsilon;
      });

      // Normalize to ensure sum == 1 after smoothing
      const sumProbs = probs.LEFT + probs.CENTER + probs.RIGHT;
      probs.LEFT /= sumProbs;
      probs.CENTER /= sumProbs;
      probs.RIGHT /= sumProbs;

      // Shannon Entropy
      const shannonEntropy = -(
        probs.LEFT * Math.log2(probs.LEFT) +
        probs.CENTER * Math.log2(probs.CENTER) +
        probs.RIGHT * Math.log2(probs.RIGHT)
      );

      // KL Divergence from uniform distribution
      const uniform = 1 / 3;
      const klDivergence = (
        probs.LEFT * Math.log2(probs.LEFT / uniform) +
        probs.CENTER * Math.log2(probs.CENTER / uniform) +
        probs.RIGHT * Math.log2(probs.RIGHT / uniform)
      );

      // Most Frequented Sources
      const sortedOutlets = Object.entries(outletsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([outlet, count]) => ({ outlet, count }));

      // Top Outlets by Time Read
      const topOutletsByTimeRead = Object.entries(outletReadTime)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([outlet, time]) => ({ outlet, time_read_seconds: Math.round(time) }));

      // Source Diversity Score
      const numUniqueOutlets = outlets.size;
      const diversityFactor = ['LEFT', 'CENTER', 'RIGHT'].filter(k => counts[k] > 0).length / 3;
      const maxGroupCount = Math.max(counts.LEFT, counts.CENTER, counts.RIGHT);
      const exposureFactor = 1 - (maxGroupCount / total);
      const balanceScore = (diversityFactor * exposureFactor).toFixed(3);
      
      // Engagement Score
      const totalReadCount = {
        LEFT: fullyReadCount.LEFT + quickReadCount.LEFT,
        CENTER: fullyReadCount.CENTER + quickReadCount.CENTER,
        RIGHT: fullyReadCount.RIGHT + quickReadCount.RIGHT,
      };
      const fullyReadPercentage = {
        LEFT: totalReadCount.LEFT > 0 ? ((fullyReadCount.LEFT / totalReadCount.LEFT) * 100).toFixed(1) : "0.0",
        CENTER: totalReadCount.CENTER > 0 ? ((fullyReadCount.CENTER / totalReadCount.CENTER) * 100).toFixed(1) : "0.0",
        RIGHT: totalReadCount.RIGHT > 0 ? ((fullyReadCount.RIGHT / totalReadCount.RIGHT) * 100).toFixed(1) : "0.0",
      };
      const quickReadPercentage = {
        LEFT: totalReadCount.LEFT > 0 ? ((quickReadCount.LEFT / totalReadCount.LEFT) * 100).toFixed(1) : "0.0",
        CENTER: totalReadCount.CENTER > 0 ? ((quickReadCount.CENTER / totalReadCount.CENTER) * 100).toFixed(1) : "0.0",
        RIGHT: totalReadCount.RIGHT > 0 ? ((quickReadCount.RIGHT / totalReadCount.RIGHT) * 100).toFixed(1) : "0.0",
      };
      const engagementScore = {
        LEFT: totalReadCount.LEFT > 0 ? ((fullyReadCount.LEFT / totalReadCount.LEFT) * 100).toFixed(1) : "0.0",
        CENTER: totalReadCount.CENTER > 0 ? ((fullyReadCount.CENTER / totalReadCount.CENTER) * 100).toFixed(1) : "0.0",
        RIGHT: totalReadCount.RIGHT > 0 ? ((fullyReadCount.RIGHT / totalReadCount.RIGHT) * 100).toFixed(1) : "0.0",
      };

      // Compute **Average Read Time (Only for Read Articles)**
      const avgReadTime = {
        LEFT: readCounts.LEFT > 0 ? (totalReadTime.LEFT / readCounts.LEFT).toFixed(1) : "N/A",
        CENTER: readCounts.CENTER > 0 ? (totalReadTime.CENTER / readCounts.CENTER).toFixed(1) : "N/A",
        RIGHT: readCounts.RIGHT > 0 ? (totalReadTime.RIGHT / readCounts.RIGHT).toFixed(1) : "N/A"
      };

      // **Reading Engagement Insight**
      const totalSeconds = totalReadTime.LEFT + totalReadTime.CENTER + totalReadTime.RIGHT;
      if (totalSeconds === 0) {
        readingBehaviorMessage = "No reading data available.";
      } else {
        const pct = {
          LEFT: (totalReadTime.LEFT / totalSeconds) * 100,
          CENTER: (totalReadTime.CENTER / totalSeconds) * 100,
          RIGHT: (totalReadTime.RIGHT / totalSeconds) * 100
        };

        const sorted = Object.entries(pct).sort((a, b) => b[1] - a[1]);
        const [top, second] = sorted;
        const diff = top[1] - second[1];

        if (diff >= 10) {
          if (top[0] === "LEFT") {
            readingBehaviorMessage = "You dedicate significantly more reading time to left-leaning articles. Consider exploring other perspectives for a more balanced view.";
          } else if (top[0] === "RIGHT") {
            readingBehaviorMessage = "You spend more time on right-leaning articles. Diversifying your reading across the spectrum could enhance your understanding.";
          } else {
            readingBehaviorMessage = "You invest most of your reading time in center-leaning articles. Exploring left and right perspectives may offer additional context.";
          }
        } else {
          readingBehaviorMessage = "Your reading time appears balanced across political leanings.";
        }
      }
      
      // **Balance Message**
      let balanceMessage = "You're consuming a diverse mix of political perspectives. Well done!";
      if (balanceScore < 0.3) {
        const dominantLeaning = 
          counts.LEFT > counts.CENTER && counts.LEFT > counts.RIGHT ? "LEFT"
          : counts.RIGHT > counts.CENTER ? "RIGHT"
          : "CENTER";
        balanceMessage = `Your interactions are heavily skewed toward ${dominantLeaning.toLowerCase()}-leaning content. Try branching out to gain a more complete picture.`;
      } else if (balanceScore < 0.6) {
        balanceMessage = "You're engaging with more than one perspective, but there's still a noticeable imbalance. A wider variety of sources can improve your news diet.";
      }

      res.json({
        political_leaning: counts.LEFT > counts.CENTER && counts.LEFT > counts.RIGHT ? "LEFT"
                        : counts.RIGHT > counts.CENTER ? "RIGHT" : "CENTER",
        interactions: counts,
        unique_outlets_read: numUniqueOutlets,
        most_frequented_sources: sortedOutlets,
        time_read_per_outlet: topOutletsByTimeRead,
        avg_read_time: avgReadTime,
        reading_behavior_message: readingBehaviorMessage,
        engagement_metrics: {
          fully_read: {
            LEFT: fullyReadPercentage.LEFT,
            CENTER: fullyReadPercentage.CENTER,
            RIGHT: fullyReadPercentage.RIGHT
          },
          quick_reads: {
            LEFT: quickReadPercentage.LEFT,
            CENTER: quickReadPercentage.CENTER,
            RIGHT: quickReadPercentage.RIGHT
          },
          engagement_score: {
            LEFT: engagementScore.LEFT,
            CENTER: engagementScore.CENTER,
            RIGHT: engagementScore.RIGHT
          },
        },
        shannon_entropy: shannonEntropy.toFixed(3),
        kl_divergence: klDivergence.toFixed(3),
        balance_score: parseFloat(balanceScore),
        balance_message: balanceMessage
      });
    });
  });
});

// Admin profile
app.get("/admin/profile", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only users with administrative privileges can access this route." });
  }

  const overview = {};

  db.get("SELECT username, email, political_leaning FROM users WHERE id = ?", [req.user.id], (err, admin) => {
    if (err) return res.status(500).json({ error: "Error fetching admin user" });
    if (!admin) return res.status(404).json({ error: "Admin user not found" });

    overview.username = admin.username;
    overview.email = admin.email;
    overview.political_leaning = admin.political_leaning;

    db.get("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'", [], (err, row) => {
      if (err) return res.status(500).json({ error: "Error fetching users count" });
      overview.totalUsers = row.totalUsers;

      db.get("SELECT COUNT(*) as totalInteractions FROM user_interactions", [], (err, row) => {
        if (err) return res.status(500).json({ error: "Error fetching user interactions count" });
        overview.totalInteractions = row.totalInteractions;

        db.get("SELECT COUNT(*) as totalRecommendations FROM user_recommendations", [], (err, row) => {
          if (err) return res.status(500).json({ error: "Error fetching user recommendations count" });
          overview.totalRecommendations = row.totalRecommendations;

          res.json(overview);
        });
      });
    });
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