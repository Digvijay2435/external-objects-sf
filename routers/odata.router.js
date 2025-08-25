const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// OData endpoint for Products
router.get('/Products', async (req, res) => {
  try {
    let query = Product.find();
    
    // Handle $top
    if (req.query.$top) {
      query = query.limit(parseInt(req.query.$top));
    }
    
    // Handle $skip
    if (req.query.$skip) {
      query = query.skip(parseInt(req.query.$skip));
    }
    
    // Handle $orderby
    if (req.query.$orderby) {
      const orderBy = req.query.$orderby.split(' ');
      const sort = {};
      sort[orderBy[0]] = orderBy[1] === 'desc' ? -1 : 1;
      query = query.sort(sort);
    }
    
    const products = await query.exec();
    
    const response = {
      "@odata.context": `${req.protocol}://${req.get('host')}${req.baseUrl}/$metadata#Products`,
      "value": products.map(product => ({
        "Id": product._id.toString(),
        "Name": product.name,
        "Description": product.description,
        "Category": product.category,
        "Price": product.price,
        "Brand": product.brand,
        "Currency": product.currency,
        "StockQuantity": product.stock_quantity,
        "ColorsAvailable": product.colors_available,
        "ImageUrl": product.imageUrl,
        "Rating": product.rating,
        "ReviewsCount": product.reviews_count,
        "Features": product.features
      }))
    };
    
    res.json(response);
  } catch (error) {
    console.error('OData query error:', error);
    res.status(500).json({ 
      error: {
        code: "500",
        message: error.message
      }
    });
  }
});

// Get single product by ID - CORRECTED for Salesforce OData format
router.get('/Products\\(:id\\)', async (req, res) => {
  try {
    let productId = req.params.id;
    
    // Remove quotes if Salesforce sends them (Products('507f1f77bcf86cd799439011'))
    if ((productId.startsWith("'") && productId.endsWith("'")) || 
        (productId.startsWith('"') && productId.endsWith('"'))) {
      productId = productId.slice(1, -1);
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        error: {
          code: "404",
          message: "Product not found"
        }
      });
    }
    
    const response = {
      "@odata.context": `${req.protocol}://${req.get('host')}${req.baseUrl}/$metadata#Products/$entity`,
      "Id": product._id.toString(),
      "Name": product.name,
      "Description": product.description,
      "Category": product.category,
      "Price": product.price,
      "Brand": product.brand,
      "Currency": product.currency,
      "StockQuantity": product.stock_quantity,
      "ColorsAvailable": product.colors_available,
      "ImageUrl": product.imageUrl,
      "Rating": product.rating,
      "ReviewsCount": product.reviews_count,
      "Features": product.features
    };
    
    res.json(response);
  } catch (error) {
    console.error('OData single product error:', error);
    res.status(500).json({ 
      error: {
        code: "500",
        message: error.message
      }
    });
  }
});

// OData metadata endpoint
router.get('/$metadata', (req, res) => {
  const metadata = `<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:DataServices>
    <Schema Namespace="ProductService" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityType Name="Product">
        <Key>
          <PropertyRef Name="Id" />
        </Key>
        <Property Name="Id" Type="Edm.String" Nullable="false" />
        <Property Name="Name" Type="Edm.String" MaxLength="255" />
        <Property Name="Description" Type="Edm.String" />
        <Property Name="Category" Type="Edm.String" MaxLength="100" />
        <Property Name="Price" Type="Edm.Decimal" Scale="2" />
        <Property Name="Brand" Type="Edm.String" MaxLength="100" />
        <Property Name="Currency" Type="Edm.String" MaxLength="3" />
        <Property Name="StockQuantity" Type="Edm.Int32" />
        <Property Name="ColorsAvailable" Type="Collection(Edm.String)" />
        <Property Name="ImageUrl" Type="Edm.String" />
        <Property Name="Rating" Type="Edm.Double" />
        <Property Name="ReviewsCount" Type="Edm.Int32" />
        <Property Name="Features" Type="Collection(Edm.String)" />
      </EntityType>
      <EntityContainer Name="ProductContainer">
        <EntitySet Name="Products" EntityType="ProductService.Product" />
      </EntityContainer>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`;
  
  res.type('application/xml');
  res.send(metadata);
});

// Service document
router.get('/', (req, res) => {
  res.json({
    "@odata.context": `${req.protocol}://${req.get('host')}${req.baseUrl}/$metadata`,
    value: [
      {
        name: "Products",
        kind: "EntitySet",
        url: "Products"
      }
    ]
  });
});

// Count endpoint - CORRECTED for Salesforce
router.get('/Products/$count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.type('text/plain');
    res.send(count.toString());
  } catch (error) {
    res.status(500).send('0');
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Product OData Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/Products',
      metadata: '/$metadata',
      count: '/Products/$count'
    }
  });
});

module.exports = router;