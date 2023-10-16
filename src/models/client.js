const mongoose = require('mongoose')
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema.Types

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Name is missing'],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, 'Phone Number is missing'],
        unique: true
    },
    cnic: {
        type: String,
        required: [true, 'cnic is missing'],
        unique: true
    },
    hashed_password: {
        type: String,
        required: [true, 'password is required']
    },
    passportNumber: {
        type: String,
        unique: true
    },
    address: {
        type: String,
        required: [true, 'address is missing'],
    },
    // passport Id should be array
    passportIds: [{
        type: ObjectId,
        ref: "Passport",
    }]
}
    , { timestamps: true }
);

// @ts-ignore
// full name trim removing space
clientSchema.pre('save', function (next) {
    if (this.fullName) {
        this.fullName = this.fullName.trim().replace(/\s+/g, ' ');
    }
    next();
});



clientSchema.virtual("password")
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

clientSchema.methods = {
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

module.exports = mongoose.model("Client", clientSchema)