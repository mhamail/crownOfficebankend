const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const cors = require('cors')
require('dotenv').config();
require('./db/conn')

const passportRoutes = require('./routes/passport')
const agentRoutes = require('./routes/agent')
const clientRoutes = require('./routes/client')
const companyRoutes = require('./routes/company')
const visaCategoryRoutes = require('./routes/visa/IdSelector/visaCategory')
const visaDestinationRoutes = require('./routes/visa/IdSelector/visaDestination')
const visaDurationRoutes = require('./routes/visa/IdSelector/visaDuration')
const visaTypeRoutes = require('./routes/visa/IdSelector/visaType')
const visaFormRoutes = require('./routes/visa/visaForm')

const swaggerOptions = require('./utils/swaggerDefine')

const app = express()

app.use(cors())
app.use(express.json())
// Parse URL-encoded form data
// app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 9000;

//routes
app.use("/api", passportRoutes);
app.use("/api", agentRoutes);
app.use("/api", clientRoutes);
app.use("/api", companyRoutes);
app.use("/api", visaCategoryRoutes);
app.use("/api", visaDestinationRoutes);
app.use("/api", visaDurationRoutes);
app.use("/api", visaTypeRoutes);
app.use("/api", visaFormRoutes);

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.listen(port, () => {
    console.log(`App is running on port # ${port}`)
})