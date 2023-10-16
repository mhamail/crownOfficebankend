// @ts-check
const express = require('express')
const router = express.Router();

const { create, list, remove} = require('../../../controllers/visa/IdSelector/visaDestination')

// adminmiddleware and superadminmiddleware required
router.post("/visa-destination/create", create)
router.get("/visa-destination", list)
router.delete("/visa-destination/remove", remove)

module.exports = router;