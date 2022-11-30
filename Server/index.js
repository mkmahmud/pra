const express = require('express')
const app = express();
require("dotenv").config();
const cors = require('cors')

const jwt = require('jsonwebtoken')

const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is runing')
})


// Mongo DB connection

const uri = `mongodb+srv://blossom:1a33uepk56DSqfCN@cluster0.cjesyyc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const userCollection = client.db('blossom').collection('Users');

async function run () {
    try {

        // insert user in Database
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = {email: email}
            const options = {upsert:true}
            const updateDoc = {
                $set: user
            }
            
            const result = await userCollection.updateOne(filter, updateDoc, options)

            const  JWTtocken = jwt.sign(user, process.env.DB_JWT_TOCKEN);
            res.send({result, JWTtocken})

        })

    }


    
    finally {
        
    }

}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`)
})