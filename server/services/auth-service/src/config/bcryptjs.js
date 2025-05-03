const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const bcryptHash = async password => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    return res.status(500).json({
      message: 'Error hashing password: ' + error.message,
    });
  }
};

const bcryptCompare = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    return res.status(500).json({
      message: 'Error comparing password: ' + error.message,
    });
  }
};

module.exports = { bcryptHash, bcryptCompare };
