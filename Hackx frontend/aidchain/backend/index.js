const express = require("express");
const app = express();
const cors = require("cors");
// dotenv is optional in this environment. Try to load if available.
try { require("dotenv").config(); } catch (e) { /* dotenv not installed, skipping */ }

app.use(express.json());
app.use(cors());

// Demo mode: skip MongoDB/mongoose and use in-memory data stores so the app runs without DB
const DEMO_MODE = true;
if (DEMO_MODE) {
	console.log('Backend running in DEMO mode (no MongoDB)');
} else {
	// In non-demo mode we would connect to MongoDB. Kept for reference.
	const mongoose = require('mongoose');
	const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/aidchain";
	mongoose
		.connect(MONGODB_URI)
		.then(() => console.log("Connected to MongoDB"))
		.catch((err) => console.error("MongoDB connection error:", err));
}

// Routes
app.use("/api/donation", require("./routes/donation"));
app.use("/api/evidence", require("./routes/evidence"));

app.get("/", (req, res) => res.send("AidChain API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
