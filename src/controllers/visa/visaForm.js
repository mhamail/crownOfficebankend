// @ts-check
const axios = require('axios');
const VisaForm = require('../../models/visa/visaForm')
const { ErrorHandler, ErrorHandler2 } = require('../../helpers/errorHandler');
const { Response } = require('../../helpers/responseHandler')
const constants = require('../../helpers/constants');


// api apply
// async function updateConversionRates(conversionRates) {
//     try {
//         // @ts-ignore
//         const response = await axios.get(process.env.exchangeApi);

//         if (response.data && response.data.rates) {
//             conversionRates.usd = response.data.rates.USD;
//             conversionRates.pound = response.data.rates.GBP;
//         }
//     } catch (error) {
//         console.error('Failed to fetch conversion rates:', error);
//     }
// }


exports.create = async (req, res) => {
    let { passportId, client, company, agent, destination, category, type, duration, currency, processing, confirmed, fee } = req.body;


    // req.body destructuring
    const data = { passportId, client, company, agent, destination, category, type, duration, currency, processing, confirmed, fee }

    try {
        let form = new VisaForm(data);
        const response = await form.save();
        res.json({
            message: "Visa Form Create Successfully",
        })
    } catch (error) {
        error?.code === 11000 ?
            Response(res, 400, ErrorHandler2(error)) :
            Response(res, 400, ErrorHandler(error))
    }
}
exports.update = async (req, res) => {
    const { passportId, client, company, agent, destination, category, type, duration,currency, fee } = req.body;
const {processing, confirmed} =req.update
    const formId = req.params.id;
    const data = { passportId, client, company, agent, destination, category, type, duration,processing, confirmed, currency, fee }
    //    removing undefined
    for (let key in data) {
        if (data[key] === undefined) {
            delete data[key];
        }
    }
    try {
        const updated = await VisaForm.findOneAndUpdate({ _id: formId }, data, {
            new: true
        });
        res.json({ message: constants.UPDATED_SUCCESS })
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }

}
exports.read = async (req, res) => {
    const formId = req.params.id;
    try {
        const form = await VisaForm.findById(formId)
            .populate([
                {
                    path: 'passportId',
                    model: 'Passport',
                    select: '-image'
                },
                {
                    path: 'client',
                    model: 'Client'
                },
                {
                    path: 'company',
                    model: 'Company'
                },
                {
                    path: 'agent',
                    model: 'Agent'
                },
                {
                    path: 'destination',
                    model: 'VisaDestination'
                },
                {
                    path: 'category',
                    model: 'VisaCategory'
                },
                {
                    path: 'type',
                    model: 'VisaType'
                },
                {
                    path: 'duration',
                    model: 'VisaDuration'
                }
            ]);

        res.json({ form });

    } catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.list = async (req, res) => {
    try {
        const form = await VisaForm.find()
            .populate([
                {
                    path: 'passportId',
                    model: 'Passport',
                    select: '-image'
                },
                {
                    path: 'client',
                    model: 'Client'
                },
                {
                    path: 'company',
                    model: 'Company'
                },
                {
                    path: 'agent',
                    model: 'Agent'
                },
                {
                    path: 'destination',
                    model: 'VisaDestination'
                },
                {
                    path: 'category',
                    model: 'VisaCategory'
                },
                {
                    path: 'type',
                    model: 'VisaType'
                },
                {
                    path: 'duration',
                    model: 'VisaDuration'
                }
            ]);
        res.json({ form })
    } catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

exports.remove = async (req, res) => {
    const formIds = req.body.formIds;
    try {
        await VisaForm.deleteMany({ _id: { $in: formIds } })
        Response(res, 200, constants.DELETE_SUCCESS)
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}

// middleware of Currency Update
exports.currencyUpdate = async (req, res, next) => {
    let { processing, confirmed } = req.body;
    const formId = req.params.id;
    try {
        const form = await VisaForm.findById(formId)
        req.form = form;
        next()
    }
    catch (error) {
        Response(res, 500, constants.GET_ERROR)
    }
}
// middleware of currency
exports.currencyConversionMiddleware = async (req, res, next) => {
    let { currency,fee } = req.body;

    // **->Start req.form and req.body handing*********************
    let processing = {};
    let confirmed = {};
    fee={
        paid:req.body.fee?.paid?req.body.fee.paid : req.form.fee?.paid,
        total:req.form.fee.total || 0,
        remaining:req.form.fee.remaining || 0
    }

    if (req.body.processing) {
        processing = req.body.processing;
         //@ts-ignore
        confirmed = {};
    } else if (req.body.confirmed) {
        confirmed = req.body.confirmed;
         //@ts-ignore
        processing = {};
    } else if (req.form) {
        // Use values from req.form if req.body doesn't contain processing or confirmed
        if(req.form.processing){
            processing = req.form.processing;
            confirmed = {};
        }
        else if(req.form.confirmed){
            confirmed = req.body.confirmed;
           processing = {};
        }
    }

    // console.log("processing:",processing, "confirmed:",confirmed)
    
    // **->End req.form and req.body handing*********************
   
    const conversionRates = {
        pkr: 1,      // Assuming 1 PKR is the base rate
        usd: 230,    // Example rate: 1 USD = 230 PKR
        pound: 300,  // Example rate: 1 Pound = 300 PKR
    };
    // // Check if currency provided is valid
    if (!conversionRates[currency]) {
        return res.status(400).json({ error: 'Invalid Currency Provided' });
    }

   
    const conversionRate = conversionRates[currency];

    if(!fee.paid){
        return  Response(res, 400, "Fees Paid is Missing")
    }
    fee.paid *= conversionRate;

    // Convert fees based on provided currency
    if (processing) {
        if (processing.processingFee) {
            processing.processingFee *= conversionRate;
        }
        if (processing.visaFee) {
            processing.visaFee *= conversionRate;
        }
    }

    if (confirmed && confirmed.totalFee) {
        confirmed.totalFee *= conversionRate;
    }

    //----* handle Fees
    if (confirmed.totalFee) {
        fee.total = confirmed.totalFee;
      
    }
    if (processing.processingFee || processing.visaFee) {
        fee.total = processing.processingFee + processing.visaFee;
    }
    if (fee.total) {
        fee.remaining = fee.total - fee.paid;
    }
    // console.log("fee:",fee)
    //----* handle Fees
    req.update = { processing, confirmed }
    next();
}