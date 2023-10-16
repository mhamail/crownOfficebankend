//@ts-check
const Passport = require('../models/passport')
const formidable = require('formidable')
const fs = require('fs');
const _merge = require('lodash.merge');
const { ErrorHandler, ErrorHandler2 } = require('../helpers/errorHandler');
const { Response } = require('../helpers/responseHandler')
const constants = require('../helpers/constants')


exports.create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "all fields required"
      })
    }
    //fields array extracted
    const extractFirstItems = (data) =>
      Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value[0]]));

    const extractedData = extractFirstItems(fields);

    const { passportNumber, nationality, surname, givenName, dob, pob, cnic, religion, gender, city, country, fatherName, doi, doe, issuingAuthority, trackingNumber, bookletNumber } = extractedData;

    // data destructuring
    let image = files.image
    let data = { passportNumber, nationality, surname, givenName, dob, pob, cnic, religion, gender, city, country, fatherName, doi, doe, issuingAuthority, trackingNumber, bookletNumber }

    // *-- image handle start
    let imageFile = image; // Assuming "image" is the name of the file input field

    if (!imageFile) {
      return res.status(400).json({
        error: 'Image file is missing',
      });
    }

    else {
      // imageFile.map(item =>;.log(item.filepath))
      const { filepath, mimetype, size } = imageFile[0]
      if (size > 10000000) {
        return Response(res, 400, "Image should be less than 1mb in size")
      }
      const imageBuffer = fs.readFileSync(filepath); // Read the file data
      const contentType = mimetype;// Get the content type from Formidable
      image = {
        // @ts-ignore
        data: imageBuffer,
        contentType: contentType,
      };
    }
    // --* image handle end

    //  **Types Fix
    // passport Number 
    data.passportNumber = Number(passportNumber);
    // tracking Number
    data.trackingNumber = Number(trackingNumber);
    //  bookletNumber
    data.bookletNumber = Number(bookletNumber)

    //saving to database
    let passport = new Passport({ ...data, image });
    try {
      const response = await passport.save()
      res.json({ message: constants.INSERT_SUCCESS })
    }
    catch (error) {
      error?.code === 11000 ?
        Response(res, 400, ErrorHandler2(error)) :
        Response(res, 400, ErrorHandler(error))
    }

  })
}

exports.read = (req, res) => {
  const passportId = req.params.id;
  Passport.findById(passportId)
    .select('-image')
    .then((passport) => {
      res.json(passport)
    })
    .catch((err) => {
      Response(res, 500, constants.GET_ERROR)
    })
}

exports.photo = (req, res) => {
  const cnic = req.params.cnic
  Passport.findOne({ cnic })
    // .select('cnic')
    .then(passport => {
      res.set('Content-Type', passport?.image?.contentType);
      return res.send(passport?.image?.data);
    }).catch(error => {
      return Response(res, 500, constants.GET_ERROR)
    })
}

exports.list = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let page = req.body.page ? parseInt(req.body.page) : 1;
  let skip = (page - 1) * limit;

  Passport.find({})
    .skip(skip)
    .limit(limit)
    .sort({ "createdAt": 1 })
    .select("-image")
    .then((passport) => {
      res.json(passport)
    })
    .catch((err) => {
      return Response(res, 500, constants.GET_ERROR)
    })
}

exports.remove = (req, res) => {
  const passportIds = req.body.passportIds
  Passport.deleteMany({ _id: { $in: passportIds } })
    .then((passport) => {
      res.json({
        message: constants.DELETE_SUCCESS
      })
    })
    .catch((err) => {
      Response(res, 500, constants.GET_ERROR)
    })
}

exports.update = async (req, res) => {
  const cnic = req.params.cnic;
  try {
    const passport = await Passport.findOne({ cnic }).select('_id');
    if (passport) {
      let form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return Response(res, 400, "form sumbit error from server")
        }

        //fields array extracted
        const extractFirstItems = (data) =>
          Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value[0]]));

        const extractedData = extractFirstItems(fields);

        const { passportNumber, trackingNumber, bookletNumber } = extractedData;

        // image destructuring
        let image = files.image

        if (image) {
          // imageFile.map(item =>;.log(item.filepath))
          const { filepath, mimetype, size } = image[0]
          if (size > 10000000) {
            return Response(res, 400, "Image should be less than 1mb in size")
          }
          const imageBuffer = fs.readFileSync(filepath); // Read the file data
          const contentType = mimetype;// Get the content type from Formidable
          image = {
            // @ts-ignore
            data: imageBuffer,
            contentType: contentType,
          };
        }

        // update handle with lodash.merge
        let passportUpdate = _merge(passport, extractedData)

        // image put
        if (image) {
          // @ts-ignore
          passportUpdate.image = image
        }

        //  **Types Fix
        // passport Number 
        if (passportNumber) {
          passportUpdate.passportNumber = Number(passportNumber);
        }
        // tracking Number
        if (trackingNumber) {
          passportUpdate.trackingNumber = Number(trackingNumber);
        }
        //  bookletNumber
        if (bookletNumber) {
          passportUpdate.bookletNumber = Number(bookletNumber)
        }

        //saving to database
        const response = await passport.save()
        res.json({ message: constants.UPDATED_SUCCESS })
      })
    }
  }
  catch (error) {
    //;.log(error.message)
    // Response(res, 400, ErrorHandler(error))
    error?.code === 11000 ?
      Response(res, 400, ErrorHandler2(error)) :
      Response(res, 400, ErrorHandler(error))
  }


}