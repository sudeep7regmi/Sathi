import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("Password reset requested for:", normalizedEmail);

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    /*
     * Don't reveal whether an account exists.
     */
    if (!user) {
      console.log("No user found for:", normalizedEmail);

      return NextResponse.json({
        success: true,
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }

    /*
     * Generate secure reset token.
     */
    const resetToken = crypto.randomBytes(32).toString("hex");

    /*
     * Hash token before storing it in database.
     */
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    /*
     * Token expires after 1 hour.
     */
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    /*
     * Reset URL sent to user.
     */
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    console.log("Reset URL generated:", resetUrl);

    /*
     * IMPORTANT:
     * For testing, use onboarding@resend.dev.
     */
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    console.log("Sending email from:", fromEmail);
    console.log("Sending email to:", user.email);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject: "Reset Your SATHI Password",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Reset Your SATHI Password</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
              font-family: Arial, Helvetica, sans-serif;
            "
          >

            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
              "
            >

              <div
                style="
                  background: #2563eb;
                  padding: 25px;
                  text-align: center;
                "
              >
                <h1
                  style="
                    color: white;
                    margin: 0;
                    font-size: 28px;
                  "
                >
                  SATHI
                </h1>

                <p
                  style="
                    color: #dbeafe;
                    margin: 8px 0 0;
                  "
                >
                  Futsal Coordination Platform
                </p>
              </div>

              <div style="padding: 35px;">

                <h2 style="color: #111827;">
                  Reset Your Password
                </h2>

                <p style="color: #4b5563;">
                  We received a request to reset the password
                  associated with your SATHI account.
                </p>

                <p style="color: #4b5563;">
                  Click the button below to create a new password.
                </p>

                <div
                  style="
                    text-align: center;
                    margin: 30px 0;
                  "
                >
                  <a
                    href="${resetUrl}"
                    style="
                      display: inline-block;
                      background: #2563eb;
                      color: white;
                      text-decoration: none;
                      padding: 13px 25px;
                      border-radius: 6px;
                      font-weight: bold;
                    "
                  >
                    Reset Password
                  </a>
                </div>

                <p
                  style="
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  This link will expire in
                  <strong>1 hour</strong>.
                </p>

                <p
                  style="
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  If you did not request this password reset,
                  you can safely ignore this email.
                </p>

              </div>

              <div
                style="
                  background: #f9fafb;
                  padding: 20px;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #9ca3af;
                    font-size: 12px;
                  "
                >
                  © ${new Date().getFullYear()} SATHI
                </p>
              </div>

            </div>

          </body>
        </html>
      `,
    });

    /*
     * Resend failed.
     */
    if (error) {
      console.error("=================================");
      console.error("RESEND ERROR");
      console.error(error);
      console.error("=================================");

      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to send password reset email.",
        },
        { status: 500 }
      );
    }

    /*
     * Resend succeeded.
     */
    console.log("=================================");
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("Resend ID:", data?.id);
    console.log("=================================");

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("=================================");
    console.error("FORGOT PASSWORD ERROR");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
