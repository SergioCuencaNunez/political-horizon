const bcrypt = require('bcryptjs');

const passwordAdmin= "Admin123";
const passwordUserRight = "Richard123";
const passwordUserCenter = "Charlotte123";
const passwordUserLeft = "Lewis123";

const hashedPassword = bcrypt.hashSync(passwordAdmin, 10);
console.log("Hashed Password:", hashedPassword);
