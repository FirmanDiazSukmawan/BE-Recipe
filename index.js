const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xssclean = require("xss-clean");
const mainRouter = require("./src/router/mainRouter");

const PORT = 3002;
app.use(cors());
app.use(helmet());
app.use(xssclean());
app.use(bodyParser.json());
app.use(mainRouter);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "server ready to use",
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// syntax menggunakan query & params

// app.get("/", function (req, res) {
//     res.send("Hello World");
// });

// // params id
// app.get("/latihan-urlparams/:id", function (req, res) {
//     const urlParams = req.params.id;

//     res.json({
//         urlParams,
//     });
// });

// // query params
// app.get("/queryparams", function (req, res) {
//     const queryParams = req.query;

//     res.json({
//         queryParams,
//     });
// });

// //
// app.get("/getheaders", function (req, res) {
//     const dataHeaders = req.headers;
//     const { token } = dataHeaders;

//     res.json(
//         // {
//         //     dataHeaders,
//         // },
//         { token },
//     );
// });

// app.post("/latihan-body", function (req, res) {
//     const body = req.body;

//     res.json({
//         body,
//         success: "data terkirim",
//     });
// });
