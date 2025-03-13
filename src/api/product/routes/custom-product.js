module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/products/new-arrivals',
      handler: 'product.getNewArrivals',
      config: {
        auth: false,
        policies: [],
      }
    },
    {
      method: 'GET',
      path: '/products/popular',
      handler: 'product.getPopularProducts',
      config: {
        auth: false,
        policies: [],
      }
    }
  ]
}; 