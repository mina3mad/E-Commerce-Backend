import nodemailer  from 'nodemailer'

const sendEmail=async({from=`"e-commerce 👻"<${process.env.EMAIL_SENDER}>`,to,userName,link}={})=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user:process.env.EMAIL_SENDER ,
          pass:process.env.EMAIL_PASS
        },
      })
      const info = await transporter.sendMail({
        from, // sender address
        to, // list of receivers
        subject: "Hello ", // Subject line
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #333;
      background-color: #fff;
    }

    .container {
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      padding: 0 0px;
      padding-bottom: 10px;
      border-radius: 5px;
      line-height: 1.8;
    }
      .container h2{
      color: #000
      }

    .header {
      border-bottom: 1px solid #eee;
    }

    .header a {
      font-size: 1.4em;
      color: #000;
      text-decoration: none;
      font-weight: 600;
    }

    .content {
      min-width: 700px;
      overflow: auto;
      line-height: 2;
    }

    .link {
      background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%);
      margin: 0 auto;
      width: max-content;
      padding: 0 10px;
      color: #fff;
      border-radius: 4px;
    }

    .footer {
      color: #aaa;
      font-size: 0.8em;
      line-height: 1;
      font-weight: 300;
    }

    .email-info {
      color: #666666;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      padding-bottom: 6px;
    }

    .email-info a {
      text-decoration: none;
      color: #00bc69;
    }
  </style>
</head>

<body>
  <!--Subject: Login Verification Required for Your [App Name] Account-->
  <div class="container">
    <div class="header">
      <a>Prove Your account</a>
    </div>
    <br />
    <strong>Dear ${userName},</strong>
    <p>
      We have received a login request for your [e-commerce] account. For
      security purposes, please verify your identity by clicking on the below link.
      <br />
      <b>Your link is:</b>
    </p>
    <h2 class="link">${link}</h2>
    <p style="font-size: 0.9em">
    <hr style="border: none; border-top: 0.5px solid #131111" />
    <div class="footer">
      <p>This email can't receive replies.</p>
    </div>
  </div>
  <div style="text-align: center">
    <div class="email-info">
      <span>
        This email was sent to
        <a href="mailto:{Email Adress}">${to}</a>
      </span>
    </div>
    <div class="email-info">
      &copy; 2023 e-cpmmerce. All rights
      reserved.
    </div>
  </div>
</body>
<!-- https://www.e-commerce.com -->
</html>`, // html body
      });
      console.log(info);
      

}
export default sendEmail