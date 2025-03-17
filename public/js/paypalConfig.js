
require("dotenv").config();
const paypal = require("@paypal/checkout-server-sdk");

function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    )
  );
}

const client = getPayPalClient();

module.exports = client;
