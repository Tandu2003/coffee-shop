const Account = require("../models/account.model");
const Verification = require("../models/verification.model");
const { bcryptCompare } = require("../config/bcryptjs");

class VerifyController {
  getVerify(req, res) {
    if (req.session.user) {
      res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
      res.status(400).json({ loggedIn: false });
    }
  }

  sendVerificationResponse(res, title, message, redirectUrl) {
    return res.send(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { text-align: center; padding: 50px; font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; }
            h1 { font-size: 24px; font-weight: bold; }
            p { font-size: 18px; margin-bottom: 20px; }
            button { padding: 10px 20px; font-size: 16px; border: 2px solid #000; background-color: #000; color: #fff; cursor: pointer; transition: 0.3s; }
            button:hover { background-color: #fff; color: #000; }
          </style>
          <script>
            let seconds = 5;
            function countdown() {
              document.getElementById("countdown").innerText = seconds;
              if (seconds > 0) {
                seconds--;
                setTimeout(countdown, 1000);
              } else {
                window.location.href = "${redirectUrl}";
              }
            }
            window.onload = countdown;
          </script>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${message} <span id="countdown">5</span> seconds...</p>
          <button onclick="window.location.href='${redirectUrl}'">Go to Page</button>
        </body>
      </html>
    `);
  }

  async getVerifyUser(req, res) {
    try {
      const { userId, uniqueString } = req.params;
      const data = await Verification.findOne({ userId });

      if (!data || data.expiresAt < Date.now()) {
        if (data) await Verification.deleteOne({ userId });
        return this.sendVerificationResponse(
          res,
          "Email Verification Failed",
          "The link has expired. Please register again!",
          "http://localhost:3000/account/register"
        );
      }

      const isMatch = await bcryptCompare(uniqueString, data.uniqueString);
      if (!isMatch) {
        return this.sendVerificationResponse(
          res,
          "Email Verification Failed",
          "Invalid verification link. Please try again!",
          "http://localhost:3000/account/register"
        );
      }

      await Account.updateOne({ _id: userId }, { verified: true });
      await Verification.deleteOne({ userId });

      return this.sendVerificationResponse(
        res,
        "Email Verified",
        "Your email has been verified successfully! Redirecting to login...",
        "http://localhost:3000/account/login"
      );
    } catch (error) {
      console.error(error);
      return this.sendVerificationResponse(
        res,
        "Email Verification Failed",
        "An error occurred. Please try again later.",
        "http://localhost:3000/account/register"
      );
    }
  }
}

module.exports = new VerifyController();
