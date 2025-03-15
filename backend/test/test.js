const bcrypt = require('bcryptjs');

const passwordUserRight = "Richard123";
const passwordUserCenter = "Charlotte123";
const passwordUserLeft = "Lewis123";

const hashedPassword = bcrypt.hashSync(passwordUserLeft, 10);
console.log("Hashed Password:", hashedPassword);
