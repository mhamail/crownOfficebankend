// @ts-check
const express = require('express')
const router = express.Router();

const { create, list, remove} = require('../../../controllers/visa/IdSelector/visaCategory')

// adminmiddleware and superadminmiddleware required
router.post("/visa-category/create", create)
router.get("/visa-category", list)
router.delete("/visa-category/remove", remove)

module.exports = router;