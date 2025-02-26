const validateTrafficData = (data) => {
  if (!data.page || typeof data.page !== "string" || data.page.trim() === "") {
    return "Page name must be a non-empty string.";
  }
  return null; // No validation errors
};

module.exports = { validateTrafficData };
