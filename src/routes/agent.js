// @ts-check
const express = require('express')
const router = express.Router();

const { create, read, list, remove, update } = require('../controllers/agent')

// adminmiddleware and superadminmiddleware required
router.post("/agent/create", create)
router.get("/agent/:id", read)
router.get("/agents", list)
router.delete("/agents/remove", remove)
router.put("/agent/update/:id", update)

module.exports = router;