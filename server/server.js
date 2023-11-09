const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();

require("dotenv").config();
app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use(cors({origin:true,credentials:true}))
const stripe = require("stripe")(process.env.PRIVATE_KEY)

app.post(process.env.POST_URL , async (req, res, next) => {
  try {
      const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

          shipping_options: [
          {
              shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                  amount: 0,
                  currency: 'usd',
              },
              display_name: 'Free shipping',
              // Delivers between 5-7 business days
              delivery_estimate: {
                  minimum: {
                  unit: 'business_day',
                  value: 5,
                  },
                  maximum: {
                  unit: 'business_day',
                  value: 7,
                  },
              }
              }
          },
          {
              shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                  amount: 1500,
                  currency: 'usd',
              },
              display_name: 'Next day air',
              // Delivers in exactly 1 business day
              delivery_estimate: {
                  minimum: {
                  unit: 'business_day',
                  value: 1,
                  },
                  maximum: {
                  unit: 'business_day',
                  value: 1,
                  },
              }
              }
          },
          ],
          shipping_address_collection: {
            allowed_countries: ['US', 'CA','IN'],
            },
         line_items:  req.body.items.map((item) => ({
          price_data: {
            currency: 'usd',
         product_data: {
              name: item.name,
              images: [item.product]
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
         mode: "payment",
         success_url: `${process.env.SERVER_PORT}/success.html`,
         cancel_url: `${process.env.SERVER_PORT}/cancel.html`,
      });

      res.status(200).json(session);
  } catch (error) {
    var statusCode = error.statusCode || 500;
    var msg = '';
    switch (statusCode) {
      case 400:
        msg = 'SErver Error - Missiong parameter';
        break;
      case 401:
        msg = 'Please Contact your Administrator - UnAuthorized';
        break;
      case 402:
        msg = 'Request Failed';
        break;
      case 403:
        msg = 'Permission Failed';
        break;
      case 404:
        msg = 'Not Found';
        break;
      case 409:
          msg = 'Request Conflict';
          break;
      case 429:
            msg = 'Too many requests';
            break;
      case 500:
        msg = 'Server Errors';
        break;
      }
      res.status(statusCode).json({ message: msg})
}
});

app.listen(4242);
