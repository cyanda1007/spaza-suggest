import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import SpazSug from "../spaza-suggest.js";
import pgp from "pg-promise";
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:Cyanda@100%@localhost:5432/spaza_suggest";

const config = {
  connectionString: DATABASE_URL,
};

if (process.env.NODE_ENV == "production") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const db = pgp(config);
// console.log(db);
const app = express();
app.use(
  session({
    secret: "index",
    resave: false,
    saveUninitialized: true,
  })
);

// initialise the flash middleware
app.use(flash());
app.use(express.static("public"));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
const Spaza = SpazSug(db);
app.use(bodyParser.json());

app.post("/registerSpaza", Spaza.registerClient(username));
app.get("/", Spaza.registerClient(username));

const PORT = process.env.PORT || 3007;

app.listen(PORT, function () {
  console.log("App started");
});
