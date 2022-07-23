const express = require('./dataProvider.js')
const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/:chain', (req,res) => {
    const chain = parseInt(req.params.chain)
    const parking = parkings.find(parking => parking.id === id)
    res.status(200).json(parking)
})

app.listen(port, () => {
  console.log(`ggQuest Server now listening on port ${port}`)
})

