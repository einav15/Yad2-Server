const User = require('../models/usersModel')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    const authentication = req.body
    try {
        const user = await User.findByCredentials(authentication.email, authentication.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login-cookie', async (req, res) => {
    const token = req.body
    try {
        const user = await User.findByCookie(token)
        res.send({ user })
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.post('/users/check-email', async (req, res) => {
    const email = req.body.email
    try {
        const user = await User.findOne({ email })
        let ret = 'X'
        if (!user)
            ret = 'K'
        res.send(ret)
    } catch (err) {
        res.status(400).send(err)
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Logged out')
    } catch (err) {
        res.status(500).send(err)
    }
})


router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out all devices')
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router