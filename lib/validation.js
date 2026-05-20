// Lightweight input validators for API routes.
// Each returns null on pass, or an error string on fail.
// No external dependencies — plain JS only.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** String: required unless optional=true, trim, length bounds */
export function str(val, { min = 1, max = 500, optional = false } = {}) {
  if (val === undefined || val === null || val === "") {
    return optional ? null : "Required";
  }
  if (typeof val !== "string") return "Must be a string";
  const t = val.trim();
  if (!optional && t.length < min)
    return `Must be at least ${min} character${min !== 1 ? "s" : ""}`;
  if (t.length > max) return `Must be at most ${max} characters`;
  return null;
}

/** Email: valid format + max length */
export function email(val) {
  const base = str(val, { max: 254 });
  if (base) return base;
  // Allow plain usernames (e.g. "admin") — not all identifiers are emails
  if (val.includes("@") && !EMAIL_RE.test(val.trim()))
    return "Invalid email address";
  return null;
}

/** Boolean: must be exactly true or false */
export function bool(val) {
  if (typeof val !== "boolean") return "Must be true or false";
  return null;
}

/** Array of strings */
export function strArray(val, { maxItems = 500, maxLen = 200 } = {}) {
  if (!Array.isArray(val)) return "Must be an array";
  if (val.length > maxItems) return `Too many items (max ${maxItems})`;
  for (const item of val) {
    if (typeof item !== "string") return "All items must be strings";
    if (item.length > maxLen) return `Item too long (max ${maxLen} chars)`;
  }
  return null;
}

/** ISO date string or null */
export function isoDate(val) {
  if (val === null || val === undefined || val === "") return null; // nullable
  if (typeof val !== "string") return "Date must be a string";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "Invalid date";
  return null;
}

/** Color value: string, max 50 chars (hex, rgb, rgba, hsl all fit) */
export function colorVal(val, { optional = true } = {}) {
  if (val === undefined || val === null || val === "")
    return optional ? null : "Required";
  if (typeof val !== "string") return "Color must be a string";
  if (val.length > 50) return "Color value too long";
  return null;
}

/** Flat object with string values */
export function strObj(val, { maxKeys = 200, maxValLen = 200 } = {}) {
  if (!val || typeof val !== "object" || Array.isArray(val))
    return "Must be an object";
  const keys = Object.keys(val);
  if (keys.length > maxKeys) return `Too many keys (max ${maxKeys})`;
  for (const k of keys) {
    if (typeof val[k] !== "string") return `Value for "${k}" must be a string`;
    if (val[k].length > maxValLen) return `Value for "${k}" is too long`;
  }
  return null;
}

/** Value must be one of an allowed set */
export function oneOf(val, allowed) {
  if (!allowed.includes(val)) return `Must be one of: ${allowed.join(", ")}`;
  return null;
}

/** Escape special regex characters to prevent ReDoS */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Collect errors from named checks; returns null if all pass */
export function validate(checks) {
  const errors = {};
  for (const [field, error] of Object.entries(checks)) {
    if (error) errors[field] = error;
  }
  return Object.keys(errors).length ? errors : null;
}
