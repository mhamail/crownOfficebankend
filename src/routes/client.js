// @ts-check
const express = require('express')
const router = express.Router();

const { create, read, list, remove, update } = require('../controllers/client')

// adminmiddleware and superadminmiddleware required
router.post("/client/create", create)
router.get("/client/:id", read)
router.get("/clients", list)
router.delete("/clients/remove", remove)
router.put("/client/update/:id", update)

module.exports = router;