/**
 * Centralized Validation Utilities for Form Validation across the Project
 */

// Phone regex: Exactly 10 digits (common for Indian mobile numbers)
export const PHONE_REGEX = /^[0-9]{10}$/;

// Name regex: Letters and spaces only, min 2 chars
export const NAME_REGEX = /^[a-zA-Z\s.'-]{3,50}$/;

// 6-digit OTP regex
export const OTP_REGEX = /^[0-9]{6}$/;

// Recognized and valid Top-Level Domains (TLDs)
const VALID_TLDS = new Set([
  "com", "org", "net", "edu", "gov", "mil", "int",
  "in", "co", "io", "ai", "ac", "info", "biz", "dev", "app",
  "me", "tech", "online", "site", "store", "xyz", "pro", "tv",
  "cc", "us", "uk", "ca", "au", "de", "fr", "jp", "cn", "ru",
  "ch", "nl", "se", "no", "es", "it", "br", "za", "mx", "sg",
  "nz", "global", "cloud", "digital", "academy", "institute", "university",
  "co.in", "ac.in", "edu.in", "res.in", "gov.in", "net.in", "org.in",
  "co.uk", "ac.uk", "org.uk", "gov.uk",
  "com.au", "edu.au", "gov.au",
  "co.nz", "ac.nz"
]);

// Common domain typos that must be rejected
const COMMON_TYPO_TLDS = new Set([
  "coom", "comm", "con", "cpm", "xom", "cmo", "col", "cm", "om", "cpm"
]);

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return "Email address is required.";
  }

  const cleanEmail = email.trim().toLowerCase();

  // Basic structural regex check
  const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  if (!basicRegex.test(cleanEmail)) {
    return "Please enter a valid email address (e.g. name@example.com).";
  }

  // Prevent consecutive dots or dot at boundary of local part
  const [localPart, domainPart] = cleanEmail.split("@");
  if (!localPart || !domainPart) {
    return "Please enter a valid email address.";
  }

  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return "Email username contains invalid dot placement.";
  }

  if (domainPart.startsWith(".") || domainPart.endsWith(".") || domainPart.includes("..")) {
    return "Email domain format is invalid.";
  }

  const domainParts = domainPart.split(".");
  if (domainParts.length < 2) {
    return "Email domain must include an extension (e.g. .com).";
  }

  const tld = domainParts[domainParts.length - 1];
  const compoundTld = domainParts.length >= 3 ? domainParts.slice(-2).join(".") : "";

  // Reject common typo TLDs like coom, comm, con
  if (COMMON_TYPO_TLDS.has(tld)) {
    return `Invalid domain extension '.${tld}'. Did you mean '.com'?`;
  }

  // Check specific major email providers
  if (domainPart.startsWith("gmail.")) {
    if (domainPart !== "gmail.com") {
      return "Invalid Gmail address. Gmail addresses must end with @gmail.com.";
    }
  }

  if (domainPart.startsWith("yahoo.")) {
    if (!["yahoo.com", "yahoo.co.in", "yahoo.in", "yahoo.co.uk"].includes(domainPart)) {
      return "Invalid Yahoo address. Please use a valid Yahoo domain (e.g. @yahoo.com).";
    }
  }

  if (domainPart.startsWith("outlook.") || domainPart.startsWith("hotmail.")) {
    const validOutlook = ["outlook.com", "outlook.in", "hotmail.com", "hotmail.co.in"];
    if (!validOutlook.includes(domainPart)) {
      return `Invalid domain '${domainPart}'. Please use a valid domain (e.g. @outlook.com).`;
    }
  }

  // Check if TLD or compound TLD is valid
  const isValidTld = VALID_TLDS.has(tld) || (compoundTld && VALID_TLDS.has(compoundTld));
  if (!isValidTld) {
    return `'.${tld}' is not a valid domain extension. Please use a valid domain (e.g. .com, .in, .edu).`;
  }

  return "";
};

export const validatePhone = (phone) => {
  if (!phone || !String(phone).trim()) {
    return "Mobile number is required.";
  }
  const cleanPhone = String(phone).trim();
  if (!/^\d+$/.test(cleanPhone)) {
    return "Mobile number must contain digits only.";
  }
  if (cleanPhone.length !== 10) {
    return "Mobile number must be exactly 10 digits.";
  }
  return "";
};

export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return "Full name is required.";
  }
  if (name.trim().length < 3) {
    return "Full name must be at least 3 characters long.";
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) {
    return "Full name should only contain letters and spaces.";
  }
  return "";
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  return "";
};

// Enrollment number: only required check, accepting all college formats
export const validateEnrollmentNo = (enrollmentNo) => {
  if (!enrollmentNo || !enrollmentNo.trim()) {
    return "Enrollment number is required.";
  }
  return "";
};

export const validateRequired = (value, fieldName = "This field") => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `${fieldName} is required.`;
  }
  return "";
};

export const validateOtp = (otp) => {
  if (!otp || !otp.trim()) {
    return "OTP is required.";
  }
  if (!OTP_REGEX.test(otp.trim())) {
    return "OTP must be exactly 6 numeric digits.";
  }
  return "";
};
