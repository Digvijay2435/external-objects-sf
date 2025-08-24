const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ODataServer = require('simple-odata-server');
const Adapter = require('simple-odata-server-mongodb');
const cors = require('cors');
const productRouter = require('./routers/product.router');
const productODataModel = require('./OData/product-odataModel');
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/product', productRouter);

app.listen(port, () => {
  console.log(`Server is up and running !!`);
});

const odataServer = ODataServer().model(productODataModel);

mongoose.connect("mongodb+srv://digvijay2435chauhan:WFFDDL4ZKp8qqZPb@cluster0.he9yo.mongodb.net/ecommerce-dev?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Database Connected Successfully !");
    odataServer.adapter(Adapter(mongoose.connection));
}).catch(error => {
    console.log(error);
});

app.use('/odata', (req, res) => {
  odataServer.handle(req, res);
});


const handler = serverless(app);

module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result;
};