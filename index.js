const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5001
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()

//middleware 

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://<username>:<password>@cluster0.sduwbrc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.get('/', async (req, res) => {
    res.send('awel headphones server is running')
})


app.listen(port, () => console.log(`awel headphone running on port ${port}`))