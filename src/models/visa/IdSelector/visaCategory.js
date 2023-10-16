// @ts-check
const mongoose = require('mongoose')

const visaCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        unique:true,
        required: [true, 'Category Name is missing'],
    }
}
    , { timestamps: true }
)

module.exports = mongoose.model("VisaCategory", visaCategorySchema)