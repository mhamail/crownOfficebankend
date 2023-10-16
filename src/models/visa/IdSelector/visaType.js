// @ts-check
const mongoose = require('mongoose')

const visaTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'Visa Type is missing'],
    }
}
    , { timestamps: true }
)

module.exports = mongoose.model("VisaType", visaTypeSchema)