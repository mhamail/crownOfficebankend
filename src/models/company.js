// @ts-check
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        trim: true,
        required: [true, 'Company Name is missing'],
    },
    licenseNo: {
        type: String,
        required: [true, 'License is missing'],
    },
    phone: {
        type: String,
        required: [true, 'Contact Number is missing'],
    },
    ownerContact: {
        type: String,
        required: [true, 'Owner Number is missing'],
    },
    hashed_password: {
        type: String,
        required: [true, 'password is required']
    },
    cnic: {
        type: String,
        required: [true, 'cnic is missing'],
    },
    address: {
        type: String,
        required: [true, 'address is missing'],
    },
    // passport Id should be array
    passportIds: [{
        type: ObjectId,
        ref: "Passport",
        index: true
    }]
}
    , { timestamps: true }
);

// @ts-ignore
companySchema.pre('save', function (next) {
    if (this.companyName) {
        this.companyName = this.companyName.trim().replace(/\s+/g, ' ');
    }
    next();
});



companySchema.virtual("password")
    .set(function (password) {
        // @ts-ignore
        this._password = password;
        // @ts-ignore
        this.salt = uuidv4();
        // @ts-ignore
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        // @ts-ignore
        return this._password
    })

companySchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return ""
        }
    },
}


module.exports = mongoose.model("Company", companySchema)