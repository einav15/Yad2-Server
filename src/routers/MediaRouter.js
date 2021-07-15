const express = require('express')
const { uploadMediaToS3 } = require('../middleware/s3-media')

const router = new express.Router()

router.post('/upload-media', uploadMediaToS3, async (req, res) => {
    if (!req.file)
        res.status(422).send({
            code: 422,
            message: "File not uploaded"
        })
    else
        res.send(req.file.location)
})


module.exports = router