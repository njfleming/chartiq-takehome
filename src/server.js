const path = require("path")
const express = require("express")

const app = express()
const PORT = 8080

//serve index.html page
app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, "../index.html")))

//serve static assets
app.use(express.static("src"))

//catch all error handler
app.use((req, res) => res.sendStatus(404))

//start server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`))

module.exports = app