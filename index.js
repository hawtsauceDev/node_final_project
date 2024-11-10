//Dependencias
const morgan = require("morgan");
const express = require("express");
const app = express();

//Rutas:
const user = require("./routes/user");

//Middleware
const auth = require("./middleware/auth");
const notFound = require("./middleware/notFound");
const index = require("./middleware/index");
const cors = require("./middleware/cors");

app.use(cors);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", index);
app.use(
  "/user",
  (req, res, next) => {
    if (req.path === "/login") {
      next(); 
    } else {
      auth(req, res, next);
    }
  },
  user
);


app.use(notFound);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running in port 3000");
});
