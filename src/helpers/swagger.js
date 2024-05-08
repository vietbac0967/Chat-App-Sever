import swaggerJsdoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      description:
        "API endpoints for a mini blog services documented on swagger",
      contact: {
        name: "Desmond Obisi",
        email: "info@miniblog.com",
        url: "https://github.com/vietbac0967/DoAnCNM",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/",
        description: "Local server",
      },
      {
        url: "<your live url here>",
        description: "Live server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
// function swaggerDocs(app, port) {
//   // Swagger Page
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   // Documentation in JSON format
//   app.get("/docs.json", (req, res) => {
//     res.setHeader("Content-Type", "application/json");
//     res.send(swaggerSpec);
//   });
// }
// export default swaggerDocs;
