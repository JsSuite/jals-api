const isEmail = (text) => {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(text);
};

module.exports = isEmail;
