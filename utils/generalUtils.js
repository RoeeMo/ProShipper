const fetch = require('node-fetch');
require('dotenv').config();

async function verifyRecaptcha(response) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCAPTCHA_SECRET}&response=${response}`;
  const res = await fetch(url, { method: 'POST' });
  const data = await res.json();

  return data;
};

module.exports = {
    verifyRecaptcha
};