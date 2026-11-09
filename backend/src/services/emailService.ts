import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPassword =
  process.env.EMAIL_PASSWORD;

if (!emailUser || !emailPassword) {
  throw new Error(
    "EMAIL_USER and EMAIL_PASSWORD are required"
  );
}

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

interface SendPasswordResetEmailParams {
  email: string;
  resetLink: string;
}

export const sendPasswordResetEmail =
  async ({
    email,
    resetLink,
  }: SendPasswordResetEmailParams) => {
    await transporter.sendMail({
      from: `"ICHGram" <${emailUser}>`,

      to: email,

      subject:
        "Reset your ICHGram password",

      text: `You requested to reset your ICHGram password.

Click the link below to create a new password:

${resetLink}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.
`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
          "
        >
          <h2>
            Reset your ICHGram password
          </h2>

          <p>
            You requested to reset your
            ICHGram password.
          </p>

          <p>
            Click the button below to create
            a new password:
          </p>

          <p>
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #0095f6;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in
            30 minutes.
          </p>

          <p>
            If you did not request a password
            reset, you can safely ignore this
            email.
          </p>
        </div>
      `,
    });
  };

