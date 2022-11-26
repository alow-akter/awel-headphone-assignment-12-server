const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5001
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()

//middleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sduwbrc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const allHeadphonesCollection = client.db('headphonesDatabase').collection('threeBrandsHeadphone')

        const allCategoryCollection = client.db('headphonesDatabase').collection('allCategory')

        app.get('/headphonesOptions', async (req, res) => {
            const query = {}
            const options = await allHeadphonesCollection.find(query).toArray()
            res.send(options)
        })
        app.get('/categoryOptions/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { productsId: id };

            const result = await allCategoryCollection.find(filter).toArray();

            res.send(result);
        })
    }
    finally {

    }

}
run().catch(console.log)




app.get('/', async (req, res) => {
    res.send('awel headphones server is running')
})


app.listen(port, () => console.log(`awel headphone running on port ${port}`))