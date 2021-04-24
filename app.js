const express = require("express");
const exphbs = require("express-handlebars");
const bp = require("body-parser");
const port = process.env.PORT || 3000;
const app = express();

// SDK de Mercado Pago
const mercadopago = require("mercadopago");

// // Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-2572771298846850-120119-a50dbddca35ac9b7e15118d47b111b5a-681067803",
});

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.get("/pending", (req, res) => {
  res.render("pending", req.query);
});

app.get("/failure", (req, res) => {
  res.render("failure", req.query);
});

app.get("/success", (req, res) => {
  res.render("success", req.query);
});

app.post("/create_preference", function (req, res) {
  const {
    body: { title, picture_url, price },
  } = req;

  const preference = {
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
    items: [
      {
        id: "1234",
        title,
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url,
        quantity: 1,
        unit_price: price,
      },
    ],
    external_reference: "edenjiga@gmail.com",
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_83958037@testuser.com",
      phone: {
        area_code: "52",
        number: 5549737300,
      },
      address: {
        street_name: "Insurgentes Sur",
        street_number: 1602,
        zip_code: "03940",
      },
    },
    auto_return: "approved",
    back_urls: {
      success: "https://edenjiga-mp-commerce-nodejs.herokuapp.com/success",
      failure: "https://edenjiga-mp-commerce-nodejs.herokuapp.com/failure",
      pending: "https://edenjiga-mp-commerce-nodejs.herokuapp.com/pending",
    },
    payment_methods: {
      installments: 6,
      excluded_payment_methods: [
        {
          id: "amex",
        },
      ],
      excluded_payment_types: [
        {
          id: "atm",
        },
      ],
    },
    notification_url:
      "https://edenjiga-mp-commerce-nodejs.herokuapp.com/webhooks",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/webhooks", (req, res) => {
  console.log(req.body, "webhooks");
  res.status(200).send();
});

app.listen(port, () => {
  console.log("app listen in port", port);
});
