const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const CLIENT_ID = 'YOUR_SANDBOX_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_SANDBOX_CLIENT_SECRET';

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

app.post('/create-order', async (req, res) => {
  try {
    const response = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: req.body.amount, // Use the amount from the request body
        },
      }],
    }, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : 'Error creating order');
  }
});

app.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;
  try {
    const response = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : 'Error capturing order');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
