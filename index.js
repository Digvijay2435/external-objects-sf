const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ODataServer = require('simple-odata-server');
const Adapter = require('simple-odata-server-mongodb');
const cors = require('cors');

const productRouter = require('./routers/product.router');
const productODataModel = require('./OData/product-odataModel');
const { init: initProductService } = require('./services/product.service');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/product', productRouter);


async function start() {
  const mongoUri = "mongodb+srv://digvijay2435chauhan:WFFDDL4ZKp8qqZPb@cluster0.he9yo.mongodb.net/ecommerce-dev?retryWrites=true&w=majority&appName=Cluster0";

  if (!mongoUri) {
    console.error('MONGODB_URI environment variable not set');
    process.exit(1);
  }

  try {
    const mongoClient = new MongoClient(mongoUri);

    // Connect to MongoDB Atlas
    await mongoClient.connect();
    console.log('MongoDB Atlas connected');

    const db = mongoClient.db();

    // Initialize your product service with native driver db
    initProductService(db);

    // Setup OData server
    const odataServer = ODataServer().model(productODataModel);
    odataServer.adapter(Adapter(mongoClient));

    app.use('/odata', (req, res) => odataServer.handle(req, res));

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (e) {
    console.error('Failed to connect to MongoDB Atlas:', e);
    process.exit(1);
  }
}

start();
const handler = serverless(app);
module.exports.handler = async (event, context) => handler(event, context);
