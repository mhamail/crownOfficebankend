// @ts-check
const express = require('express')
const router = express.Router();

const { create, read, list, remove, update } = require('../controllers/company')

// adminmiddleware and superadminmiddleware required
router.post("/company/create", create)
router.get("/company/:id", read)
router.get("/company", list)
router.delete("/company/remove", remove)
router.put("/company/update/:id", update)

module.exports = router;