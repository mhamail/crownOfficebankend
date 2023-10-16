//@ts-check
const mongoose = require('mongoose')
const crypto = require("crypto")
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema.Types

const agentSchema = new mongoose.Schema({
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
        required: [true, 'passport Number is missing'],
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
        index: true
    }]
}
    , { timestamps: true }
);

// @ts-ignore
agentSchema.pre('save', function (next) {
    if (this.fullName) {
        this.fullName = this.fullName.trim().replace(/\s+/g, ' ');
    }
    next();
});



// agentSchema.virtual("password")
//     .set(function (password) {
//         // @ts-ignore
//         this._password = password;
//         // @ts-ignore
//         this.salt = uuidv4();
//         // @ts-ignore
//         this.hashed_password = this.encryptPassword(password)
//     })
//     .get(function () {
//         // @ts-ignore
//         return this._password
//     })

// agentSchema.methods = {
//     authenticate: function (plainText) {
//         return this.encryptPassword(plainText) === this.hashed_password
//     },
//     encryptPassword: function (password) {
//         if (!password) return '';
//         try {
//             return crypto
//                 .createHmac('sha1', this.salt)
//                 .update(password)
//                 .digest('hex')
//         }
//         catch (err) {
//             return ""
//         }
//     },
// }

agentSchema.virtual("password")
    .set(function (password) {
         // @ts-ignore
        this._password = password;
         // @ts-ignore
        this.salt = uuidv4();
         // @ts-ignore
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
         // @ts-ignore
        return this._password;
    });

agentSchema.methods = {
    authenticate: function (plainText) {
        return bcrypt.compareSync(plainText, this.hashed_password);
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return bcrypt.hashSync(password, 10); // Hash the password using bcrypt
        } catch (err) {
            return "";
        }
    },
};


// Pre-save middleware to hash the password if required
// agentSchema.pre('save', function (next) {
//     if (!this.isModified('hashed_password')) {
//         return next();
//     }

//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) {
//             return next(err);
//         }

//         bcrypt.hash(this.hashed_password, salt, (err, hash) => {
//             if (err) {
//                 return next(err);
//             }
//             this.hashed_password = hash;
//             next();
//         });
//     });
// });



module.exports = mongoose.model("Agent", agentSchema)