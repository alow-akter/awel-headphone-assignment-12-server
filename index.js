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

        const myOrdersCollection = client.db('headphonesDatabase').collection('myOrders')

        const addProductCollection = client.db('headphonesDatabase').collection('addProduct')


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

        app.post('/myOrders', async (req, res) => {
            const myOrders = req.body;
            const result = myOrdersCollection.insertOne(myOrders)
            res.send(result)
        })
        app.get('/myAllOrders', async (req, res) => {
            const query = {}
            const myAllOrders = await myOrdersCollection.find(query).toArray()
            res.send(myAllOrders)
        })
        app.post('/addProduct', async (req, res) => {
            const addProduct = req.body;
            const result = await addProductCollection.insertOne(addProduct)
            res.send(result)
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