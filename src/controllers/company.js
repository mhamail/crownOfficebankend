// @ts-check
const Company = require('../models/company')
const generator = require('generate-password');
const { ErrorHandler, ErrorHandler2 } = require('../helpers/errorHandler');
const { Response } = require('../helpers/responseHandler')
const constants = require('../helpers/constants');

exports.create = async (req, res) => {
    const { companyName, licenseNo, phone, ownerContact, password, cnic, address, passportIds } = req.body;
    // req.body destructuring
    const data = { companyName, licenseNo, phone, ownerContact, cnic, address, password, passportIds }
    data.password = generator.generate({
        length: 10,
        numbers: true
    });
    data.phone = Number(phone);
    let arrayofPostIds = [].concat(...passportIds.map(id => id.split(',')));
    const uniquePassportIds = [...new Set(arrayofPostIds)];

    data.passportIds = uniquePassportIds;
    try {
        let company = new Company(data);
        const response = await company.save();
        res.json({
            message: "company Create Successfully",
            password: data.password
        })
    } catch (error) {
        error?.code === 11000 ?
            Response(res, 400, ErrorHandler2(error)) :
            Response(res, 400, ErrorHandler(error))
    }
}

exports.read = async (req, res) => {
    const companyId = req.params.id;
    try {
        const company = await Company.findById(companyId)
            .populate({
                path: 'passportIds',
                model: 'Passport',
                select: '-image',
            });
        res.json({ company })
    } catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.list = async (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    try {
        const company = await Company.find()
            .populate({
                path: 'passportIds',
                select: '-image',
                options: { limit, skip, sort: { createdAt: -1 } }
            });
        res.json({ company });
    } catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.update = async (req, res) => {
    const { fullName, phone, cnic, passportNumber, address, password, passportIds } = req.body;

    const companyId = req.params.id;
    const data = { fullName, phone, cnic, passportNumber, address, password, passportIds }
    //    removing undefined
    for (let key in data) {
        if (data[key] === undefined) {
            delete data[key];
        }
    }

    // handle creating password
    if (password) {
        data.password = generator.generate({
            length: 10,
            numbers: true
        });
    }
    if (passportIds) {
        // let newPostIds = [].concat(...passportIds.map(id => id.split(',')));
        // finding pre passportIds
        const prePassportIds = await Company.findById(companyId)
            .populate({
                path: 'passportIds',
                select: '_id',
            })
            .select(passportIds);
        const digPrePassportIds = prePassportIds?.passportIds
        // @ts-ignore
        const prePassportIdsString = [].concat(...digPrePassportIds?.map(item => item._id.toString()));

        // merging with lodash old one with new
        const mergePassportIds = [...new Set([...prePassportIdsString, ...passportIds])];
        data.passportIds = mergePassportIds
    }


    try {

        const updatedCompany = await Company.findOneAndUpdate({ _id: companyId }, data, {
            new: true
        });
        res.json({ message: constants.UPDATED_SUCCESS })
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }

}

exports.remove = async (req, res) => {
    const companyIds = req.body.companyIds;
    try {
        await Company.deleteMany({ _id: { $in: companyIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}