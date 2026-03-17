module.exports = {
  MERCHANT_ID: (process.env.PHONEPE_MERCHANT_ID || "").trim(),
  SALT_KEY: (process.env.PHONEPE_SALT_KEY || "").trim(),
  SALT_INDEX: (process.env.PHONEPE_SALT_INDEX || "").trim(),
  HOST_URL: (process.env.PHONEPE_HOST_URL || "https://api.phonepe.com/apis/hermes").trim(),
  CLIENT_ID: (process.env.PHONEPE_CLIENT_ID || "").trim(),
  CLIENT_VERSION: (process.env.PHONEPE_CLIENT_VERSION || "1").trim(),
  CLIENT_SECRET: (process.env.PHONEPE_CLIENT_SECRET || "").trim()
};
