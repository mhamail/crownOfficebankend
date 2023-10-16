// @ts-check
const express = require('express')
const router = express.Router();

const { create, list, remove} = require('../../../controllers/visa/IdSelector/visaType')

// adminmiddleware and superadminmiddleware required
router.post("/visa-type/create", create)
router.get("/visa-type", list)
router.delete("/visa-type/remove", remove)

module.exports = router;