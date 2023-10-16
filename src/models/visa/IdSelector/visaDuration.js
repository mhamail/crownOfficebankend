// @ts-check
const mongoose = require('mongoose')

const visaDurationSchema = new mongoose.Schema({
    duration: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'Visa Duration is missing'],
    },
    validity: {
        type: String,
        trim: true,
    },
}
    , { timestamps: true }
)

module.exports = mongoose.model("VisaDuration", visaDurationSchema)