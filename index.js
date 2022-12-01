const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5001
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');


const app = express()

//middleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sduwbrc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    //  console.log('token inside verifyJWT', req.headers.authorization);
    const authHedaer = req.headers.authorization
    if (!authHedaer) {
        return res.status(401).send('unauthorized access')
    }

    const token = authHedaer.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
}


async function run() {
    try {
        const allHeadphonesCollection = client.db('headphonesDatabase').collection('threeBrandsHeadphone')

        const allCategoryCollection = client.db('headphonesDatabase').collection('allCategory')

        const myOrdersCollection = client.db('headphonesDatabase').collection('myOrders')

        const addProductCollection = client.db('headphonesDatabase').collection('addProduct')

        const usersCollection = client.db('headphonesDatabase').collection('users')


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

        app.get('/myAllOrders', verifyJWT, async (req, res) => {
            const query = {}
            const myAllOrders = await myOrdersCollection.find(query).toArray()
            res.send(myAllOrders)
        })

        app.post('/addProduct', async (req, res) => {
            const addProduct = req.body;
            const result = await addProductCollection.insertOne(addProduct)
            res.send(result)
        })

        app.get('/myProduct', verifyJWT, async (req, res) => {
            const query = {}
            const myProduct = await addProductCollection.find(query).toArray()
            res.send(myProduct)
        })


        app.get('/jwt', async (req, res) => {
            const email = req.query.email
            const query = { email: email };
            const user = await usersCollection.findOne(query)
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '10h' })
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })


        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })

        app.get('/allBuyer', async (req, res) => {
            const query = {}
            const options = await usersCollection.find(query).toArray()
            const result = options.filter(option => option.role === 'Buyer')
            res.send(result)
        })

        app.get('/allSeller', async (req, res) => {
            const query = {}
            const options = await usersCollection.find(query).toArray()
            const result = options.filter(option => option.role === 'Seller')
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email

            const query = { email }
            const user = await usersCollection.findOne(query)

            res.send(user)
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