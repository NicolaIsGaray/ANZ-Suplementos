const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dotEnv = require("dotenv");
dotEnv.config();

const PORT = process.env.PORT;
const MONGO_U = process.env.MONGO_U;
const MONGO_P = process.env.MONGO_P;

const mongoose = require("mongoose");
const url = `mongodb+srv://${MONGO_U}:${MONGO_P}@generaldata.5ebr4.mongodb.net/?retryWrites=true&w=majority&appName=generalData`

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const routes = require("./routes/index");
app.use("/", routes);

app.use(
    express.static("public", {
      setHeaders: (res, path) => {
        if (path.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        }
      },
    }),
  );

const connectToMongo = async () => {
    try {
        await mongoose.connect(url);
        app.listen(PORT, () => {
            console.log(`El servidor está levantado en el puerto ${PORT} y conectado a la base de datos.`);
        })
    } catch (error) {
        console.log(error);
    }
}

connectToMongo();