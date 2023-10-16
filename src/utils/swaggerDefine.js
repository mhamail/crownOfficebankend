
const swaggerDefinition = {
    openapi: "3.1.0",
    info: {
        title: 'My API Documentation',
        version: '1.0.0',
        description: 'Documentation of my API.......',
        contact: {
            name: "skills with me",
            url: "test.com",
            email: "test@email.com",
        },
    },

    servers: [
        {
            url: `http://localhost:${process.env.PORT}`, // Update with your server URL
            description: 'Development server',
        },
    ],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // Path to the API routes folder
};

module.exports = swaggerOptions;