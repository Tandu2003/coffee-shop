const { bcryptHash, bcryptCompare } = require('../config/bcryptjs');
const Account = require('../models/account.model');
const sendVerificationEmail = require('../config/nodemailer');
const { generateToken, verifyToken } = require('../utils/jwtTokens');

class AuthController {
  // [GET] /api/auth
  getAuth(req, res) {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ loggedIn: false });

    const user = verifyToken(token);
    if (!user) return res.status(401).json({ loggedIn: false });

    return res.status(200).json({ loggedIn: true, user });
  }

  // [POST] /api/auth/register
  async postRegister(req, res) {
    let { username, email, password } = req.body;
    username = username?.trim().toLowerCase();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    try {
      const [existingUsername, existingEmail] = await Promise.all([
        Account.findOne({ username }),
        Account.findOne({ email }),
      ]);

      if (existingUsername)
        return res.status(400).json({ message: 'Username already exists' });
      if (existingEmail)
        return res.status(400).json({ message: 'Email already exists' });

      const hashedPassword = await bcryptHash(password);
      const newAccount = new Account({
        username,
        email,
        password: hashedPassword,
      });

      await newAccount.save();
      await sendVerificationEmail(newAccount, res);

      return res.status(201).json({
        message:
          'Account created successfully! Please verify your email to login',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // [POST] /api/auth/login
  async postLogin(req, res) {
    try {
      const { identifier, password, remember } = req.body;

      const account = await Account.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!account)
        return res.status(400).json({ message: 'Account does not exist' });

      const isMatch = await bcryptCompare(password, account.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Incorrect password' });

      if (!account.verified)
        return res.status(400).json({
          message: 'Please verify your email before logging in.',
        });

      const userPayload = {
        _id: account._id,
        username: account.username,
        email: account.email,
        isAdmin: account.isAdmin,
      };

      const token = generateToken(userPayload);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        loggedIn: true,
        user: userPayload,
        message: 'Login successful',
      });
    } catch (error) {
      console.error('[Login Error]', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // [POST] /api/auth/logout
  postLogout(req, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  }
}

module.exports = new AuthController();
