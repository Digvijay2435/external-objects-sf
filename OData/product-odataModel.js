const productODataModel = {
  namespace: 'api',
  entityTypes: {
    'ProductType': {
      'id': { type: 'Edm.String', key: true }, // MongoDB _id as string
      'name': { type: 'Edm.String' },
      'description': { type: 'Edm.String' },
      'category': { type: 'Edm.String' },
      'price': { type: 'Edm.Double' },
      'brand': { type: 'Edm.String' },
      'currency': { type: 'Edm.String' },
      'stock_quantity': { type: 'Edm.Int32' },
      'colors_available': { type: 'Collection(Edm.String)' },
      'imageUrl': { type: 'Edm.String' },
      'rating': { type: 'Edm.Double' },
      'reviews_count': { type: 'Edm.Int32' },
      'features': { type: 'Collection(Edm.String)' }
    }
  },
  entitySets: {
    'Products': {
      entityType: 'api.ProductType'
    }
  }
};

module.exports = productODataModel;