const express = require('express')
const app = express()
const port = process.env.PROCCESS || 5000
const cors = require('cors')
// const homeRouter = require('./routes/home')
const userRouter = require('./routers/user')
const kriteriaRouter = require('./routers/kriteria')
const subkriteriaRouter = require('./routers/subkriteria')
const alternatifRouter = require('./routers/alternatif')
const relAlternatifRouter = require('./routers/relalternatif')
const vikorRouter = require('./routers/vikor')
const mooraRouter = require('./routers/moora')
const masterRouter = require('./routers/master')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// app.use('/home', homeRouter)
app.use('/user', userRouter)
app.use('/kriteria', kriteriaRouter)
app.use('/subkriteria', subkriteriaRouter)
app.use('/alternatif', alternatifRouter)
app.use('/relAlternatif', relAlternatifRouter)
app.use('/vikor', vikorRouter)
app.use('/moora', mooraRouter)
app.use('/master', masterRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

module.exports = app 