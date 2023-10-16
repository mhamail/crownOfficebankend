// @ts-check
const mongoose = require('mongoose')

const visaForSchema = new mongoose.Schema({
    country: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'country is missing'],
    }
}
    , { timestamps: true }
)

module.exports = mongoose.model("VisaDestination", visaForSchema)