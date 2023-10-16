// @ts-check
const Agent = require('../models/agent')
const generator = require('generate-password');
const { ErrorHandler, ErrorHandler2 } = require('../helpers/errorHandler');
const { Response } = require('../helpers/responseHandler')
const constants = require('../helpers/constants');


exports.create = async (req, res) => {
    const { fullName, phone, cnic, passportNumber, address, password, passportIds } = req.body;
    // req.body destructuring
    const data = { fullName, phone, cnic, passportNumber, address, password, passportIds }
    data.password = generator.generate({
        length: 10,
        numbers: true
    });
    data.phone = Number(phone);

    const uniquePassportIds = [...new Set(passportIds)];

    data.passportIds = uniquePassportIds;
    try {
        let agent = new Agent(data);
        const response = await agent.save();
        res.json({
            message: "Agent Create Successfully",
            password: data.password
        })
    } catch (error) {
        error?.code === 11000 ?
            Response(res, 400, ErrorHandler2(error)) :
            Response(res, 400, ErrorHandler(error))
    }
}

exports.read = async (req, res) => {
    const agentId = req.params.id;
    try {
        const agent = await Agent.findById(agentId)
            .populate({
                path: 'passportIds',
                model: 'Passport',
                select: '-image',
            });
        res.json({ agent })
    } catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.list = async (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    try {
        const agent = await Agent.find()
            .populate({
                path: 'passportIds',
                select: '-image',
                options: { limit, skip, sort: { createdAt: -1 } }
            });
        res.json({ agent });
    } catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.update = async (req, res) => {
    const { fullName, phone, cnic, passportNumber, address, password, passportIds } = req.body;

    const agentId = req.params.id;
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
        const prePassportIds = await Agent.findById(agentId)
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
        console.log(data.passportIds)
    }


    try {

        const updatedAgent = await Agent.findOneAndUpdate({ _id: agentId }, data, {
            new: true
        });
        console.log(updatedAgent)
        res.json({ message: constants.UPDATED_SUCCESS })
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }

}

exports.remove = async (req, res) => {
    const agentIds = req.body.agentIds;
    try {
        await Agent.deleteMany({ _id: { $in: agentIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}