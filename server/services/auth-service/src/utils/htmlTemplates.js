function getVerifyHtml({ title, message, buttonText, url }) {
  return `<!DOCTYPE html>
  <html>
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
      <p>You will be redirected in <span id="countdown">5</span> seconds...</p>
      <button onclick="window.location.href='${url}'">${buttonText}</button>
    </body>
  </html>`;
}

module.exports = getVerifyHtml;
