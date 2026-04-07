import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Echo Blog API',
      version: '1.0.0',
      description: 'API documentation for the Echo Blog project',
    },
    servers: [{ url: 'http://localhost:5000' }], // Your backend URL
  },
  apis: ['./routes/*.js'], // Where to look for the documentation comments
};

export const specs = swaggerJsdoc(options);