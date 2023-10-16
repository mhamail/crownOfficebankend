// @ts-check
const mongoose = require('mongoose')

const passportSchema = new mongoose.Schema(
    {
        passportNumber: {
            type: Number,
            required: true,
            index: true,
            unique: true
        },
        nationality: {
            type: String,
            required: [true, 'Nationality is required'],
            trim: true,
        },
        surname: {
            type: String,
            trim: true,
            required: [true, 'Surname is required'],
        },
        givenName: {
            type: String,
            trim: true,
            required: [true, 'Given Name is required'],
        },
        // data of birth
        dob: {
            type: Date,
            required: [true, 'Date of Birth is required'],
        },
        // place of birth
        pob: {
            type: String,
            required: [true, 'Place of Birth is required'],
        },
        cnic: {
            type: String,
            required: [true, 'CNIC is required'],
            unique: true,
        },
        religion: {
            type: String,
            required: [true, 'Religion is required'],
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is missing'],
        },
        fatherName: {
            type: String,
            required: [true, 'Father Name is missing'],
        },
        //Digital Object Identifier
        doi: {
            type: String,
            required: [true, 'Digital Object Identifier is missing'],
        },
        // date of expiry
        doe: {
            type: String,
            required: [true, 'Date of Expiry is missing'],
        },
        // country
        issuingAuthority: {
            type: String,
            required: [true, 'Issuing Authority is missing'],
        },
        trackingNumber: {
            type: Number,
            required: [true, 'Tracking Number is missing'],
            unique: true,
        },
        bookletNumber: {
            type: Number,
            required: [true, 'Booklet Number is missing'],
            unique: true,
        },
        image: {
            data: Buffer ,
            contentType: String,
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model("Passport", passportSchema)