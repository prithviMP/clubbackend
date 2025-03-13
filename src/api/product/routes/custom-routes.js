module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/products/brand/:brandId/related',
      handler: 'product.getRelatedProductsByBrand',
      config: {
        auth: false,
      },
    },
  ],
}; 