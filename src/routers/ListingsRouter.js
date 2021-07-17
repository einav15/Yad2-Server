const Listings = require('../models/listingModel')
const express = require('express')
const router = new express.Router()

const getOnlyFive = (list, date, last) => {
    const data = [...list]
    const ret = data.filter(d => (d.updatedAt <= date) && (d._id != last?._id)).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5)
    return ret
}

router.post('/listing', async (req, res) => {
    const listing = new Listings({
        ...req.body,
    })
    try {
        await listing.save()
        res.status(201).send(listing._id)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/listing/:id', async (req, res) => {
    const updates = req.body
    const _id = req.params.id
    try {
        const data = await Listings.findOneAndUpdate({ _id }, updates)
        res.send(data)
    } catch (e) {
        console.log(e)
    }
})

router.get('/listings', async (req, res) => {
    const last = req.query.last ? JSON.parse(req.query.last) : null
    const dateFrom = last ? new Date(last.updatedAt) : new Date()
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {}
    try {
        const list = await Listings.find(filters)
        const data = getOnlyFive(list, dateFrom, last)
        res.send({ data, length: list.length })
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/listing/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const data = await Listings.findOne({ _id })
        res.send(data)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/listings/advanced', async (req, res) => {
    const { address, assetTypes, numOfRooms, priceRange, advancedSearchOptions } = JSON.parse(req.query.filters)
    let propertyType, city, street, number, floorNum
    const checkBoxes = {}
    for (const [key, value] of Object.entries(advancedSearchOptions.checkBoxes)) {
        if (value)
            checkBoxes[key] = true
    }
    try {
        const listings = await Listings.find({

            // propertyType: assetTypes,
            // city: address.city || "",
            // street: address.street || "",
            // "address.floorNum": { $gte: advancedSearchOptions.floors[0], $lt: advancedSearchOptions.floors[1] },
            "propertyInfo.numOfRooms": { $gte: numOfRooms[0], $lt: (numOfRooms[1] === 0 ? 100 : numOfRooms[1] + 1) },
            // "propertyInfo.freeText": { $regex: new RegExp(advancedSearchOptions.freeText, "g") },
            //"payments.actualSize": { $gte: advancedSearchOptions.size[0], $lt: (advancedSearchOptions.size[1] == -1 ? Infinity : advancedSearchOptions.size[1]) },

            // entryDate: advancedSearchOptions.entryDate
        })
        if (!listings)
            return res.status(404).send()
        res.status(200).send(listings)
    } catch (err) {
        res.status(500).send(err)
    }

})


// payments: {
//     numOfPayments: {
//         type: String
//     },
//     buildingFee: {
//         type: Number
//     },
//     arnona: {
//         type: Number
//     },
//     size: {
//         type: Number
//     },
//     actualSize: {
//         type: Number
//     },
//     price: {
//         type: Number
//     },
//     entryDate: {
//         type: Date
//     }
// },
// mediaUrls: {
//     video: {
//         type: String
//     },
//     mainImg: {
//         type: String
//     },
//     images: [{
//         type: String
//     }]
// },

router.delete('/listing', async (req, res) => {
    try {
        const listing = await Listings.findOneAndDelete({ _id: req.body._id })
        if (!listing)
            return res.status(404).send()
        res.send(listing._id)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.delete('/listings', async (req, res) => {
    try {
        const listings = await Listings.find({})
        for (const listing of listings) {
            await Listings.findOneAndDelete({ _id: listing._id })
        }
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})


module.exports = router
