const Listings = require('../models/listingModel')
const express = require('express')
const router = new express.Router()

const getOnlyFive = (list, date) => {
    const data = [...list]
    const ret = data.filter(d => d.updatedAt <= date).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5)
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
    const dateFrom = req.body.laterThan ? new Date(req.body.laterThan) : new Date()
    try {
        const list = await Listings.find({})
        const data = getOnlyFive(list, dateFrom)
        res.send(data)
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
    const title = req.query.title
    try {
        const listings = await Listings.find({
            "title": { $regex: new RegExp(title, "g") },
            "price": { $gte: price[0], $lt: price[1] },
        })
        if (!listings)
            return res.status(404).send()
        res.status(200).send(listings)
    } catch (err) {
        res.status(500).send(err)
    }

})

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
