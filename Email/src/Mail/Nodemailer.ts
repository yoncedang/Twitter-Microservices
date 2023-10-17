


import nodemailer from 'nodemailer';
import { IP_ADDRESS } from '../Config/Config';

class classNodemailer {


  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "dev.huydang@gmail.com", // Your email address
      pass: "ogqodogodpwwdjzv", // Your email password or application-specific password
    },
  });

  public SendLinkVerification = async (email: string, verificationToken: string, code: number | string): Promise<boolean | void> => {
    try {
      // Email content
      const mailOptions = {
        from: 'dev.huydang@gmail.com', // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: 'Xác nhận đăng ký tài khoản', // Tiêu đề email
        html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <style>
                         /* Thêm CSS vào email */
                         body {
                         font-family: Arial, sans-serif;
                         background-color: #f6f6f6;
                         margin: 0;
                         padding: 0;
                         }
                         .container {
                         max-width: 600px;
                         margin: 0 auto;
                         padding: 20px;
                         }
                         .header {
                         background-color: #007bff;
                         color: #ffffff;
                         padding: 10px;
                         text-align: center;
                         }
                         .content {
                         background-color: #ffffff;
                         padding: 20px;
                         border-radius: 5px;
                         }
                         .button {
                         display: block;
                         width: 200px;
                         margin: 20px auto;
                         padding: 10px 20px;
                         background-color: #007bff;
                         color: #ffffff;
                         text-align: center;
                         text-decoration: none;
                         border-radius: 5px;
                         }
                    </style>
                    </head>
                    <body>
                    <div class="container">
                         <div class="header">
                         <h1>Email xác thực Tài Khoản</h1>
                         </div>
                         <div class="content">
                         <p>Vui lòng click vào liên kết dưới đây để xác nhận đăng ký tài khoản:</p>
                         <a class="button" href="http://${IP_ADDRESS}:8888/api/auth/verify-email?verification=${verificationToken}">Xác nhận đăng ký</a>
                         <h1>Verification Code is: ${code}</h1>
                         <h3>Liên kết sẽ hết hạn trong 1 giờ</h3>
                         </div>
                    </div>
                    </body>
                    </html>
               `, // Nội dung email
      };
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification code email sent successfully: ${email}`);
      return true

    } catch (error) {
      console.error("Error sending verification code email: ", error);
      throw new Error("Error sending verification code email");

    }
  };

  public RequestVerification = async (email: string, verificationToken: string, code: number | string): Promise<boolean | void> => {
    try {
      // Email content
      const mailOptions = {
        from: 'dev.huydang@gmail.com', // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: 'Request a link verifications', // Tiêu đề email
        html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <style>
                      /* Thêm CSS vào email */
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f6f6f6;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                      }
                      .header {
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 10px;
                        text-align: center;
                      }
                      .content {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                      }
                      .button {
                        display: block;
                        width: 200px;
                        margin: 20px auto;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1>Request Verification Link</h1>
                      </div>
                      <div class="content">
                        <p>Vui lòng click vào liên kết dưới đây để xác nhận đăng ký tài khoản:</p>
                        <a class="button" href="http://${IP_ADDRESS}:8888/api/auth/verify-email?verification=${verificationToken}">Xác nhận đăng ký</a>
                        <h1>Verification Code is: ${code}</h1>
                        <h3>Liên kết sẽ hết hạn trong 1 giờ</h3>
                      </div>
                    </div>
                  </body>
                  </html>
                `, // Nội dung email
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);


      console.log(`Verification code email sent successfully: ${email}`);
      return true

    } catch (error) {
      console.error("Error sending verification code email: ", error);
      throw new Error("Error sending verification code email");

    }
  };

  public ForgotPassword = async (email: string, verificationToken: string): Promise<boolean | void> => {
    try {
      // Email content
      const mailOptions = {
        from: 'dev.huydang@gmail.com', // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: 'Forgot Passwrod - Quên mật khẩu', // Tiêu đề email
        html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <style>
                      /* Thêm CSS vào email */
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f6f6f6;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                      }
                      .header {
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 10px;
                        text-align: center;
                      }
                      .content {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                      }
                      .button {
                        display: block;
                        width: 200px;
                        margin: 20px auto;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1>Forgot Passwrod - Quên mật khẩu</h1>
                      </div>
                      <div class="content">
                        <p>Vui lòng click vào liên kết dưới đây để ĐỔI PASSWORD:</p>
                        <a class="button" href="http://${IP_ADDRESS}:8888/api/auth/reset-password?reset=${verificationToken}">Xác nhận đăng ký</a>
                        <h2>Liên kết sẽ hết hạn trong 1 giờ</h2>
                      </div>
                    </div>
                  </body>
                  </html>
                `, // Nội dung email
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);


      console.log(`Verification code email sent successfully: ${email}`);
      return true

    } catch (error) {
      console.error("Error sending verification code email: ", error);
      throw new Error("Error sending verification code email");

    }
  };

  public ChangeEmail = async (email: string, verificationToken: string): Promise<boolean | void> => {
    try {
      // Email content
      const mailOptions = {
        from: 'dev.huydang@gmail.com', // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: 'Change Email - Thay đổi Email', // Tiêu đề email
        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  /* Thêm CSS vào email */
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f6f6f6;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px;
                    text-align: center;
                  }
                  .content {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                  }
                  .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Xác nhận thay đổi Email</h1>
                  </div>
                  <div class="content">
                    <p>Vui lòng click vào liên kết dưới đây để xác nhận thay đổi Email</p>
                    <a class="button" href="http://${IP_ADDRESS}:8888/api/auth/confirm-change-email?confirm=${verificationToken}">Xác nhận thay đổi Email</a>
                    <h2>Liên kết sẽ hết hạn trong 1 giờ</h2>
                  </div>
                </div>
              </body>
              </html>
            `, // Nội dung email
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);


      console.log(`Verification code email sent successfully: ${email}`);
      return true

    } catch (error) {
      console.error("Error sending verification code email: ", error);
      throw new Error("Error sending verification code email");

    }
  };

  public NotificationSuspend = async (email: string): Promise<boolean | void> => {
    try {
      // Email content
      const mailOptions = {
        from: 'dev.huydang@gmail.com', // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: 'SUSPENDED ACCOUNT', // Tiêu đề email
        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  /* Thêm CSS vào email */
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f6f6f6;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px;
                    text-align: center;
                  }
                  .content {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                  }
                  .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>SUSPENDED ACCOUNT</h1>
                  </div>
                  <div class="content">
                    <h1>Hello: ${email}</h1>
                    <h3>Your account has been suspended, if there is an error please contact via Email: huydang.dev@gmail.com</h3>
                  </div>
                </div>
              </body>
              </html>
            `, // Nội dung email
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);


      console.log(`Verification code email sent successfully: ${email}`);
      return true

    } catch (error) {
      console.error("Error sending verification code email: ", error);
      throw new Error("Error sending verification code email");

    }
  };

  public NotificationUnsuspend = async (email: string): Promise<boolean | void> => {
    try {
      // Email content
      const mailOptions = {
        from: 'dev.huydang@gmail.com', // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: 'UNSUSPEND ACCOUNT', // Tiêu đề email
        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  /* Thêm CSS vào email */
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f6f6f6;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px;
                    text-align: center;
                  }
                  .content {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                  }
                  .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>UNSUSPENDED ACCOUNT</h1>
                  </div>
                  <div class="content">
                    <h1>Hello: ${email}</h1>
                    <h3>Your account has been UNLOCKED / UNSUSPENDED If you have any information, please contact via Email: huydang.dev@gmail.com</h3>
                  </div>
                </div>
              </body>
              </html>
            `, // Nội dung email
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);


      console.log(`Verification code email sent successfully: ${email}`);
      return true

    } catch (error) {
      console.error("Error sending verification code email: ", error);
      throw new Error("Error sending verification code email");

    }
  };
}


export default classNodemailer;