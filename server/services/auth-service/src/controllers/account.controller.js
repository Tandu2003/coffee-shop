const Accounts = require("../models/account.model.js");

class AccountController {
  // [GET] /api/accounts
  async getAll(req, res) {
    try {
      const data = await Accounts.find({});
      const filterPassword = data.map(({ _id, username, email, verified, isAdmin }) => ({
        _id,
        username,
        email,
        verified,
        isAdmin,
      }));
      res.json(filterPassword);
    } catch (error) {
      // res.status(500).json({ err: error });
      res.json({ status: 500, message: error });
    }
  }

  // [POST] /api/accounts
  async put(req, res) {
    const email = req.params.email;
    const { isAdmin } = req.body;
    try {
      await Accounts.findOne({ email }).updateOne({
        isAdmin: isAdmin,
      });

      res.json({ status: 200, message: "Update successfully" });
    } catch (error) {
      res.json({ status: 500, message: error });
    }
  }
}

module.exports = new AccountController();
