const { reviewCollection, verifyJWT } = require("../index.js");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

module.exports.postMyReviews = async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
};

module.exports.getAllMyReviews = async (req, res) => {
  verifyJWT(res, req, async () => {
    let query = {};
    const email = req.query.email;
    const decoded = req.decoded;
    if (req.query.email !== decoded.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    if (email) {
      query = { email: email };
    }
    const reviews = reviewCollection.find(query, { sort: { date: -1 } });
    const result = await reviews.toArray();
    res.send(result);
  });
};

module.exports.deleteMyReviews = async (req, res) => {
  verifyJWT(res, req, async () => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await reviewCollection.deleteOne(query);
    res.send(result);
  });
};

module.exports.patchMyReviews = async (req, res) => {
  verifyJWT(res, req, async () => {
    const id = req.params.id;
    const { feedback, rating } = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedReview = {
      $set: {
        feedback: feedback,
        rating: rating,
      },
    };
    const result = await reviewCollection.updateOne(
      filter,
      updatedReview,
      options
    );
    res.send(result);
  });
};
