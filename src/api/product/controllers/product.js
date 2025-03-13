'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  // Existing methods...

  async getNewArrivals(ctx) {
    try {
      // Get query parameters
      const { pageSize = 4, page = 1 } = ctx.query;

      // Build the query
      const query = {
        sort: { createdAt: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        },
        populate: ctx.query.populate,
      };

      // Fetch products
      const { results: products, pagination } = await strapi.service('api::product.product').find(query);

      // Return formatted response
      return {
        data: products,
        meta: {
          pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            pageCount: pagination.pageCount,
            total: pagination.total,
          },
        },
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getPopularProducts(ctx) {
    try {
      // Get query parameters
      const { pageSize = 4, page = 1 } = ctx.query;

      // Build the query
      const query = {
        sort: { rating: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        },
        populate: ctx.query.populate,
      };

      // Fetch products
      const { results: products, pagination } = await strapi.service('api::product.product').find(query);

      // Return formatted response
      return {
        data: products,
        meta: {
          pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            pageCount: pagination.pageCount,
            total: pagination.total,
          },
        },
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getRelatedProductsByBrand(ctx) {
    try {
      const { brandId } = ctx.params;
      const { excludeProductId } = ctx.query;
      
      // Validate brandId
      if (!brandId) {
        return ctx.badRequest('Brand ID is required');
      }

      // Query for products with the same brand
      const products = await strapi.db.query('api::product.product').findMany({
        where: {
          brand: brandId,
          ...(excludeProductId ? { id: { $ne: parseInt(excludeProductId) } } : {}),
        },
        populate: {
          product_image: true,
          brand: {
            select: ['id', 'brand_name', 'description'],
          },
          sizes: {
            select: ['id', 'size', 'number_of_items'],
          },
        },
        limit: 4,
      });

      // Transform the response
      const sanitizedProducts = await this.sanitizeOutput(products, ctx);

      return {
        data: sanitizedProducts,
        meta: {
          count: sanitizedProducts.length,
        },
      };
    } catch (error) {
      console.error('Error fetching related products:', error);
      return ctx.internalServerError('An error occurred while fetching related products');
    }
  },
}));
