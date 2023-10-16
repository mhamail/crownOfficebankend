// @ts-check
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const visaFormSchema = new mongoose.Schema({
    passportId: {
        type: ObjectId,
        ref: "Passport",
        required: [true, "Passport is missing"],
        index: true
    },
    // one required between client, company, and agent
    client: {
        type: ObjectId,
        ref: "Client",
        index: true
    },
    company: {
        type: ObjectId,
        ref: "Company",
        index: true
    },
    agent: {
        type: ObjectId,
        ref: "Agent",
        index: true
    },
    destination: {
        type: ObjectId,
        ref: "VisaDestination",
        required: [true, "Duration is missing"],
        index: true
    },
    category: {
        type: ObjectId,
        ref: "VisaCategory",
        required: [true, "Category is missing"],
        index: true
    },
    type: {
        type: ObjectId,
        ref: "VisaType",
        required: [true, "Type is missing"],
        index: true
    },
    duration: {
        type: ObjectId,
        ref: "VisaDuration",
        required: [true, "Duration is missing"],
        index: true
    },
    // one is select even confirmed or processing
    processing: {
        processingFee: {
            type: Number,
            required: [true, 'processing fees is missing'],
        },
        visaFee: {
            type: Number,
            required: [true, 'visa fees is missing'],
        }
    },

    confirmed: {
        totalFee: {
            type: Number
        }
    },
    fee: {
        total: {
            type: Number,
        },
        paid: {
            type: Number,
            required: [true, 'paid fees is missing'],
        },
        remaining: {
            type: Number,
            default: 0
        }
    },
    currency: {
        type: String,
        default: "pkr",
        enum: [
            "pkr",
            "usd",
            "pound"
        ]
    }
}
    , { timestamps: true }
)

// check required client,company or agent
visaFormSchema.pre('validate', function (next) {
    if (!this.client && !this.company && !this.agent) {
        next(new Error(' Field Missing Please Check'));
    } else {
        next();
    }

});
// handle one is select between client,company and agent
visaFormSchema.pre('validate', function (next) {
    const fields = [this.client, this.company, this.agent];
    const numOfFieldsPresent = fields.filter(Boolean).length;

    if (numOfFieldsPresent !== 1) {
        next(new Error(' Exactly one among Client, Company, or Agent should be Present'));
    } else {
        next();
    }

});

// check required processing or confirmed && handle one is select between processing or confirmed
visaFormSchema.pre('validate', function (next) {
    const hasProcessingFields = Boolean(this.processing?.processingFee || this.processing?.visaFee);
    const hasConfirmedFields = Boolean(this.confirmed?.totalFee);

    if (hasProcessingFields && hasConfirmedFields) {
        next(new Error(' Only one among processing or confirmed should be present'));
    } else if (!hasProcessingFields && !hasConfirmedFields) {
        next(new Error(' One among processing or confirmed should be present'));
    } else {
        next();
    }
});


module.exports = mongoose.model("VisaForm", visaFormSchema) 