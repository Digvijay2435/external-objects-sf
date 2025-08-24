const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRouter = require('./routers/product.router');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/product', productRouter);

app.listen(3000, () => {
  console.log(`Server is up and running !!`);
});

mongoose.connect("mongodb+srv://digvijay2435chauhan:WFFDDL4ZKp8qqZPb@cluster0.he9yo.mongodb.net/ecommerce-dev?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Database Connected Successfully !");
}).catch(error => {
    console.log(error);
});


const handler = serverless(app);

module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result;
};