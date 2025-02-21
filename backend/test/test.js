const bcrypt = require('bcryptjs');

const passwordAdmin = "Admin123"; // Replace with the password you want for the admin account
const passwordUser = "User123"; // Replace with the password you want for the admin account

const hashedPassword = bcrypt.hashSync(passwordUser, 10);
console.log("Hashed Password:", hashedPassword);
