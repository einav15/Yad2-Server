const express = require('express')
const cors = require('cors')
const ListingsRouter = require('./routers/ListingsRouter')
const MediaRouter = require('./routers/MediaRouter')
const UsersRouter = require('./routers/UsersRouter')
const app = express()

require('./db/mongoose')

app.use(express.json())
app.use(cors())
app.use(ListingsRouter)
app.use(UsersRouter)
app.use(MediaRouter)

// app.use("/", (req, res) => {
//     res.send("ok");
// });


module.exports = app