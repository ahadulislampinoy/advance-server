const { serviceCollection } = require("../index.js");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

module.exports.getAllServices = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const query = {};
  const services = serviceCollection.find(query).limit(limit);
  const result = await services.toArray();
  res.send(result);
};

module.exports.getASpecificService = async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const services = await serviceCollection.findOne(query);
  res.send(services);
};

module.exports.postAService = async (req, res) => {
  const service = req.body;
  const result = await serviceCollection.insertOne(service);
  res.send(result);
};
