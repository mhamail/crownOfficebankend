//@ts-check
const VisaType = require('../../../models/visa/IdSelector/visaType')
const { ErrorHandler, ErrorHandler2 } = require('../../../helpers/errorHandler');
const { Response } = require('../../../helpers/responseHandler')
const constants = require('../../../helpers/constants');

exports.create = async (req, res) => {
    const { type } = req.body;
    const visaType = new VisaType({ type })
    try {
        const response = await visaType.save();
        res.json({
            message: "Visa Type Create Successfully",
        })
    }
    catch (error) {
        error?.code === 11000 ?
            Response(res, 400, ErrorHandler2(error)) :
            Response(res, 400, ErrorHandler(error))
    }
}


exports.list = async (req, res) => {
    try {
        const type = await VisaType.find();
        res.json({ type });
    }
    catch (err) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.remove = async (req, res) => {
    const typeIds = req.body.typeIds;
    try {
        await VisaType.deleteMany({ _id: { $in: typeIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}