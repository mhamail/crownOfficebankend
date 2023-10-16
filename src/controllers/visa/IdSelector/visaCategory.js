//@ts-check
const VisaCategory = require('../../../models/visa/IdSelector/visaCategory')
const { ErrorHandler, ErrorHandler2 } = require('../../../helpers/errorHandler');
const { Response } = require('../../../helpers/responseHandler')
const constants = require('../../../helpers/constants');

exports.create = async (req, res) => {
    const { name } = req.body;
    const category = new VisaCategory({ name })
    try {
        const response = await category.save();
        res.json({
            message: "Visa Category Create Successfully",
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
        const category = await VisaCategory.find();
        res.json({ category });
    }
    catch (err) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.remove = async (req, res) => {
    const categoryIds = req.body.categoryIds;
    try {
        await VisaCategory.deleteMany({ _id: { $in: categoryIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}