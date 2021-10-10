module.exports = {
  success: (msg) => {
    console.log(`[SUCCESS] - ${msg}`);
  },
  debug: (msg) => {
    console.error(`[DEBUG] - ${msg}`);
  },
  error: (msg) => {
    console.error(`[ERROR] - ${msg}`);
  },
};
