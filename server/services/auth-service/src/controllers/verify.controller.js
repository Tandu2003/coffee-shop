const Account = require('../models/account.model');
const Verification = require('../models/verification.model');
const getVerifyHtml = require('../utils/htmlTemplates');
const { bcryptCompare } = require('../config/bcryptjs');

class VerifyController {
  // [GET] /api/auth/user/verify
  getVerify(req, res) {
    const user = req.user;
    if (user) {
      return res.status(200).json({ loggedIn: true, user });
    }
    return res.status(400).json({ loggedIn: false });
  }

  // [GET] /api/auth/user/verify/:userId/:uniqueString
  async getVerifyUser(req, res) {
    const { userId, uniqueString } = req.params;
    const redirectBase = process.env.CLIENT_URL;

    try {
      const data = await Verification.findOne({ userId });

      if (!data) {
        return res.send(
          getVerifyHtml({
            title: 'Email Verification Failed',
            message: 'Verification data not found. Please register again.',
            buttonText: 'Go to Register',
            url: `${redirectBase}/register`,
          }),
        );
      }

      if (data.expiresAt < Date.now()) {
        await Verification.deleteOne({ userId });
        return res.send(
          getVerifyHtml({
            title: 'Email Verification Failed',
            message: 'The link has expired. Please register again.',
            buttonText: 'Go to Register',
            url: `${redirectBase}/register`,
          }),
        );
      }

      const isMatch = await bcryptCompare(uniqueString, data.uniqueString);
      if (!isMatch) {
        return res.send(
          getVerifyHtml({
            title: 'Email Verification Failed',
            message: 'Invalid or tampered verification link.',
            buttonText: 'Go to Register',
            url: `${redirectBase}/register`,
          }),
        );
      }

      await Account.updateOne({ _id: userId }, { verified: true });
      await Verification.deleteOne({ userId });

      return res.send(
        getVerifyHtml({
          title: 'Email Verification Success',
          message: 'Your email has been verified successfully!',
          buttonText: 'Go to Login',
          url: `${redirectBase}/login`,
        }),
      );
    } catch (error) {
      console.error('[Verification Error]:', error);
      return res.send(
        getVerifyHtml({
          title: 'Email Verification Failed',
          message: 'Unexpected error occurred. Please try again.',
          buttonText: 'Go to Register',
          url: `${redirectBase}/register`,
        }),
      );
    }
  }
}

module.exports = new VerifyController();
