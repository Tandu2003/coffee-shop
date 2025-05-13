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
  }  // [PUT] /api/accounts/:email
  async updateAdmin(req, res) {
    const email = req.params.email;
    const { isAdmin } = req.body;
    
    try {
      console.log(`Updating account ${email} with isAdmin=${isAdmin}`);
      
      if (isAdmin === undefined) {
        return res.status(400).json({
          message: 'isAdmin field is required',
        });
      }
      
      const result = await Accounts.findOneAndUpdate(
        { email },
        { isAdmin },
        { new: true }
      ).select('-password');
      
      if (!result) {
        return res.status(404).json({
          message: 'Account not found',
        });
      }

      console.log(`Account updated successfully: ${JSON.stringify(result)}`);
      
      res.status(200).json({
        message: 'Update account successfully',
        account: result
      });
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({
        message: 'Update account failed: ' + (error.message || 'Unknown error'),
      });
    }
  }
  // [DELETE] /api/accounts/:email
  async deleteAccount(req, res) {
    const email = req.params.email;
    try {
      const deletedAccount = await Accounts.findOneAndDelete({ email });
      
      if (!deletedAccount) {
        return res.status(404).json({
          message: 'Account not found',
        });
      }
      
      res.status(200).json({
        message: 'Delete account successfully',
        account: deletedAccount
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Delete account failed',
      });
    }
  }
}

module.exports = new AccountController();
