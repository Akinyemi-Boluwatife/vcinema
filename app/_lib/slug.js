import { randomBytes } from "node:crypto";

export function generateSlug(byteLen = 8) {
  return randomBytes(byteLen).toString("base64url");
}
