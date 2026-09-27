import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-admin-password.mjs \"your-password\"");
  process.exit(1);
}
const salt = randomBytes(16);
const derived = await promisify(scrypt)(password, salt, 64);
console.log(`scrypt$${salt.toString("base64url")}$${Buffer.from(derived).toString("hex")}`);
