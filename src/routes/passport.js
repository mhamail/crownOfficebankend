// @ts-check

const express = require('express')
const router = express.Router();

const { create, read, photo, list, remove, update } = require('../controllers/passport')

// admin-middleware and super-admin-middleware required
router.post("/passport/create", create)
router.get("/passport/:id", read)
router.get("/passport/photo/:cnic", photo)
router.get("/passports", list)
router.delete("/passports/remove", remove)
router.put("/passport/update/:cnic", update)

module.exports = router;