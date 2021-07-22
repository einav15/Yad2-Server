const Listings = require('../models/listingModel')
const express = require('express')
const router = new express.Router()
const { getFilters } = require('../auxFunc')

const getOnlyFive = (list, date, included) => {
    const data = [...list]
    const makeSureNotIncuded = (id) => {
        if (included)
            for (let i = 0; i < included.length; i++) {
                if (id == included[i]) {
                    return false
                }
            }
        return true
    }
    const ret = data.filter(d => (d.updatedAt <= date && makeSureNotIncuded(d._id)))?.sort((a, b) => b.updatedAt - a.updatedAt)?.slice(0, 5)
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
        const old = await Listings.findOne({ _id })
        const data = await Listings.findOneAndUpdate({ _id }, { propertyInfo: { ...old._doc.propertyInfo, ...updates } })
        res.send(data)
    } catch (e) {
        console.log(e)
    }
})

router.get('/listings', async (req, res) => {
    const last = req.query.last ? JSON.parse(req.query.last) : null
    const included = req.query.included || null
    const dateFrom = last ? new Date(last.updatedAt) : new Date()
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {}
    try {
        const list = await Listings.find(filters)
        const data = getOnlyFive(list, dateFrom, included)
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
    const last = req.query.last ? JSON.parse(req.query.last) : null
    const included = req.query.included || null
    const dateFrom = last ? new Date(last.updatedAt) : new Date()
    const filters = getFilters(req.query.filters)

    try {
        const list = await Listings.find(filters)
        const data = getOnlyFive(list, dateFrom, included)
        res.send({ data, length: list.length })
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
