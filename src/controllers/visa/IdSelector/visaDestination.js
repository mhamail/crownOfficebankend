//@ts-check
const VisaDestination = require('../../../models/visa/IdSelector/visaDestination')
const { ErrorHandler, ErrorHandler2 } = require('../../../helpers/errorHandler');
const { Response } = require('../../../helpers/responseHandler')
const constants = require('../../../helpers/constants');

exports.create = async (req, res) => {
    const { country } = req.body;
    const destination = new VisaDestination({ country })
    try {
        const response = await destination.save();
        res.json({
            message: "Visa Destination Create Successfully",
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
        const destination = await VisaDestination.find();
        res.json({ destination });
    }
    catch (err) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.remove = async (req, res) => {
    const destinationIds = req.body.destinationIds;
    try {
        await VisaDestination.deleteMany({ _id: { $in: destinationIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}