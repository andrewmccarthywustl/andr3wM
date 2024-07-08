// This is a mock database. In a real application, you'd use an actual database.
const users = [
  {
    id: 1,
    username: "admin",
    // This is a hashed version of 'password'. In production, never store plain text passwords
    passwordHash:
      "$2b$10$Iw7Jn8Aj0FXzn1Rj6/dqhO1H5zqZbIz5uSMRKwpL7fzZ8MeWJ5uI2",
  },
];

module.exports = { users };
