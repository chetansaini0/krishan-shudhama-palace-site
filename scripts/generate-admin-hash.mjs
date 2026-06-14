#!/usr/bin/env node
/**
 * Generate bcrypt hash for ADMIN_PASSWORD_HASH.
 * Usage: node scripts/generate-admin-hash.mjs "YourSecurePassword"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error("Usage: node scripts/generate-admin-hash.mjs \"YourSecurePassword\"");
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nAdd to Vercel / .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
