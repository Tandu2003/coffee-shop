const Accounts = require('../models/account.model.js');

class AccountController {
  // [GET] /api/accounts
  async getAccounts(req, res) {
    try {
      const data = await Accounts.find().select('-password -__v');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        message: 'Get accounts failed',
      });
    }
  }

  // [PUT] /api/accounts
  async updateAdmin(req, res) {
    const email = req.params.email;
    const { isAdmin } = req.body;
    try {
      await Accounts.findOne({ email }).updateOne({
        isAdmin: isAdmin,
      });

      res.status(200).json({
        message: 'Update account successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Update account failed',
      });
    }
  }
}

module.exports = new AccountController();
