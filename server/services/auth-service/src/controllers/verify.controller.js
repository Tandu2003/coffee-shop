const Account = require("../models/account.model");
const Verification = require("../models/verification.model");
const { bcryptCompare } = require("../config/bcryptjs");

class VerifyController {
  // [GET] /api/auth/user/verify
  getVerify(req, res) {
    if (req.session.user) {
      res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
      res.status(400).json({ loggedIn: false });
    }
  }

  // [GET] /api/auth/user/verify/:userId/:uniqueString
  async getVerifyUser(req, res) {
    const patternHtml = (title, message, buttonText, url) => {
      return `<html>
                  <head>
                    <title>${title}</title>
                    <style>
                      body {
                        text-align: center;
                        padding: 50px;
                        font-family: Arial, sans-serif;
                        background-color: #ffffff;
                        color: #000000;
                      }
                      h1 {
                        font-size: 30px;
                        font-weight: bold;
                      }
                      p {
                        font-size: 22px;
                        margin-bottom: 20px;
                      }
                      button {
                        padding: 16px 24px;
                        margin-top: 20px;
                        font-size: 20px;
                        border: 3px solid #000;
                        background-color: #000;
                        color: #fff;
                        cursor: pointer;
                        transition: 0.3s;
                        text-transform: uppercase;
                      }
                      button:hover {
                        background-color: #fff;
                        color: #000;
                      }
                    </style>
                    <script>
                      let seconds = 5;
                      function countdown() {
                        document.getElementById("countdown").innerText = seconds;
                        if (seconds > 0) {
                          seconds--;
                          setTimeout(countdown, 1000);
                        } else {
                          window.location.href = "${url}";
                        }
                      }
                      window.onload = countdown;
                    </script>
                  </head>
                  <body>
                    <h1>${title}</h1>
                    <p>${message}</p>
                    <p>You will be redirected to the login page in <span id="countdown">5</span> seconds...</p>
                    <button onclick="window.location.href='${url}'">
                      ${buttonText}
                    </button>
                  </body>
                </html>
                `;
    };

    try {
      const { userId, uniqueString } = req.params;

      const data = await Verification.findOne({ userId });

      if (!data) {
        return res.send(
          patternHtml(
            "Email Verification Failed",
            "The link has expired. Please register again!",
            "Go to Register",
            "http://localhost:3000/account/register"
          )
        );
      }

      if (data.expiresAt < Date.now()) {
        await Verification.deleteOne({ userId });
        return res.send(
          patternHtml(
            "Email Verification Failed",
            "The link has expired. Please register again!",
            "Go to Register",
            "http://localhost:3000/account/register"
          )
        );
      }

      const isMatch = await bcryptCompare(uniqueString, data.uniqueString);
      if (!isMatch) {
        return res.send(
          patternHtml(
            "Email Verification Failed",
            "The link has expired. Please register again!",
            "Go to Register",
            "http://localhost:3000/account/register"
          )
        );
      }

      await Account.updateOne({ _id: userId }, { verified: true });

      await Verification.deleteOne({ userId });

      return res.send(
        patternHtml(
          "Email Verification Success",
          "Your email has been verified!",
          "Go to Login",
          "http://localhost:3000/account/login"
        )
      );
    } catch (error) {
      console.error(error);
      return res.send(
        patternHtml(
          "Email Verification Failed",
          "The link has expired. Please register again!",
          "Go to Register",
          "http://localhost:3000/account/register"
        )
      );
    }
  }
}

module.exports = new VerifyController();
