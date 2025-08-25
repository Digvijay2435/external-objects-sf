const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const MONGODB_URL = process.env.MONGO_DB_URL;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));


const odataRoutes = require('./routers/odata.router');
app.use('/odata', odataRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'MongoDB Products OData API for Salesforce',
    endpoints: {
      odataService: '/odata',
      metadata: '/odata/$metadata',
      products: '/odata/Products',
      health: '/odata/health'
    },
    usage: {
      getAllProducts: 'GET /odata/Products',
      filterExample: 'GET /odata/Products?$filter=Price gt 100',
      topExample: 'GET /odata/Products?$top=10',
      orderByExample: 'GET /odata/Products?$orderby=Price desc'
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OData service available at: http://localhost:${PORT}/odata`);
  console.log(`Metadata: http://localhost:${PORT}/odata/$metadata`);
});