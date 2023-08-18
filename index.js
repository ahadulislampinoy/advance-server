const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dbConnect = require("./dbConnect.js");
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Index route
app.get("/", (req, res) => {
  res.send("Beauty Base Server Is Working");
});

// MongoDB connection
dbConnect();

// Verify jwt
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const client = dbConnect();
    const serviceCollection = client.db("beautyBase").collection("services");
    const reviewCollection = client.db("beautyBase").collection("reviews");

    // Jwt
    app.post("/jwt", (req, res) => {
      const userEmail = req.body;
      const token = jwt.sign(userEmail, process.env.ACCESS_TOKEN, {
        expiresIn: "10d",
      });
      res.send({ token });
    });

    app.get("/serviceReviews", async (req, res) => {
      const id = req.query.serviceId;
      const query = { serviceId: id };
      const reviews = reviewCollection.find(query, { sort: { date: -1 } });
      const result = await reviews.toArray();
      res.send(result);
    });

    // Export
    module.exports = { serviceCollection, reviewCollection, verifyJWT };

    // Service route
    const servicesRoute = require("./routes/services.route.js");
    app.use("/services", servicesRoute);

    // Myreviews route
    const myreviewsRoute = require("./routes/myreviews.route.js");
    app.use("/myreviews", myreviewsRoute);
  } finally {
  }
}
run().catch(console.dir);

// notfound routes
app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => {
  console.log(`Beauty Base Server Is Running On Port ${port}`);
});
