// @ts-check
const express = require('express')
const router = express.Router();

const { create, list, remove} = require('../../../controllers/visa/IdSelector/visaDuration')

// adminmiddleware and superadminmiddleware required
router.post("/visa-duration/create", create)
router.get("/visa-duration", list)
router.delete("/visa-duration/remove", remove)

module.exports = router;