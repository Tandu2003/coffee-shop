const bcrypt = require("bcryptjs");

const bcryptHash = async (data, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashData = await bcrypt.hash(data, salt);
    return hashData;
  } catch (error) {
    res.status(500).json({ message: "Data encryption error!!!" });
  }
};

const bcryptCompare = async (data, hash, res) => {
  try {
    const validData = await bcrypt.compare(data, hash);
    return validData;
  } catch (error) {
    res.status(500).json({ message: "Data comparison error!!!" });
  }
};

module.exports = { bcryptHash, bcryptCompare };
