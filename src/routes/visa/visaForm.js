// @ts-check
const express = require('express')
const router = express.Router();

const { create,currencyConversionMiddleware,currencyUpdate,read,list,update,remove } = require('../../controllers/visa/visaForm')

// adminmiddleware and superadminmiddleware required
router.post("/visa-form/create",currencyConversionMiddleware,create)
router.put("/visa-form/update/:id",currencyUpdate,currencyConversionMiddleware, update)
router.get("/visa-form/:id", read)
router.get("/visa-forms", list)
router.delete("/visa-forms/remove", remove)


module.exports = router;