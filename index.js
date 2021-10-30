require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(formidable());

/* MAILGUN CONFIGURATION */
const api_key = process.env.MAILGUN_API_KEY; /* VOTRE CLÉ API */
const domain = process.env.MAILGUN_DOMAINE; /* VOTRE DOMAINE SANDBOX */
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/", (req, res) => {
  /* DESTRUCTURING */
  const { firstname, lastname, email, subject, message } = req.fields;
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "sandrine.ferey5@gmail.com" /* EMAIL AVEC LAQUELLE VOUS VOUS ÊTES ENREGISTRÉS SUR MAILGUN */,
    subject: subject,
    text: message,
  };

  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res
        .status(200)
        .json({ message: "Données bien reçues ! Email bien envoyé !" });
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("server is started");
});
