import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const pendingRegistrations = new Map();
const OTP_TTL_MS = 10 * 60 * 1000;

const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true";
const mailFrom = process.env.MAIL_FROM || smtpUser;

const transporter = smtpHost && smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })
  : null;

const normalizeKey = (value) => value.trim().toLowerCase();

const isExpired = (entry) => Date.now() > entry.expiresAt;

const clearExpiredEntry = (identifier) => {
  const entry = pendingRegistrations.get(identifier);

  if (entry && isExpired(entry)) {
    pendingRegistrations.delete(identifier);
    return null;
  }

  return entry || null;
};

export const createSignupChallenge = async (registration) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const identifier = normalizeKey(registration.identifier);

  pendingRegistrations.set(identifier, {
    ...registration,
    identifier,
    otpHash,
    expiresAt: Date.now() + OTP_TTL_MS
  });

  return { otp, identifier };
};

export const sendSignupOtpEmail = async ({ to, otp }) => {
  if (!transporter || !mailFrom) {
    console.log(`[signup] OTP for ${to}: ${otp}`);
    return { delivered: false };
  }

  await transporter.sendMail({
    from: mailFrom,
    to,
    subject: "Your STEMIFY signup OTP",
    text: `Your STEMIFY verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2>STEMIFY verification code</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 28px; letter-spacing: 4px; font-weight: 700;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  });

  return { delivered: true };
};

export const verifySignupOtp = async (identifier, otp) => {
  const normalizedIdentifier = normalizeKey(identifier);
  const entry = clearExpiredEntry(normalizedIdentifier);

  if (!entry) {
    return { ok: false, reason: "expired" };
  }

  const matches = await bcrypt.compare(String(otp), entry.otpHash);

  if (!matches) {
    return { ok: false, reason: "invalid" };
  }

  pendingRegistrations.delete(normalizedIdentifier);

  return { ok: true, entry };
};