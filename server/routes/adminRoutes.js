const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");
const { users } = require("../config/database");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/admin", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the admin panel!" });
});

module.exports = router;
