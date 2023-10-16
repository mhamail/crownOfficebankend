//@ts-check
const VisaDuration = require('../../../models/visa/IdSelector/visaDuration')
const { ErrorHandler, ErrorHandler2 } = require('../../../helpers/errorHandler');
const { Response } = require('../../../helpers/responseHandler')
const constants = require('../../../helpers/constants');

exports.create = async (req, res) => {
    const { duration } = req.body;
    const visaDuration = new VisaDuration({ duration })
    try {
        const response = await visaDuration.save();
        res.json({
            message: "Visa Duration Create Successfully",
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
        const duration = await VisaDuration.find();
        res.json({ duration });
    }
    catch (err) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.remove = async (req, res) => {
    const durationIds = req.body.durationIds;
    try {
        await VisaDuration.deleteMany({ _id: { $in: durationIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}