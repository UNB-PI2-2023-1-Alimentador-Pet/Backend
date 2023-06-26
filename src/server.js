const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");

const app = express();

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: require("../swagger.json"),
  apis: ["./routes.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3333, () =>
  console.log("Server running")
);
