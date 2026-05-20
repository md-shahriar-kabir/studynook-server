// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
dotenv.config()

const uri = process.env.MONGODB_URI;

const app = express()
const port = process.env.port;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

const verifyToken = async (req, res, next) =>{
  const authHeader = req?.headers?.authorization
  if(!authHeader){
    return res.status(401).json({message:"Unauthorized"});
  }
  const token = authHeader.split(" ")[1];
  console.log(token)

  if(!token){
    return res.status(401).json({message:"Unauthorized"});
  }
  
  try {
    const {payload} = await jwtVerify(token, JWKS)
  console.log(payload)
   next()
  } catch (error) {
    return res.status(403).json({message: "Forbidden"});
  }
  
}

async function run() {
  try {
    // await client.connect();

    const db = client.db("studynook")
    const roomCollection = db.collection("rooms")
    const bookingCollection = db.collection("bookings")

    app.get('/featured', async(req, res) =>{
      const result = await roomCollection.find().limit(4).toArray()
      res.json(result)
    })

    app.get('/room', async (req, res) => {
      const result = await roomCollection.find().toArray()
      res.json(result);
    })

    app.post('/room', async (req, res) => {
      const roomData = req.body
      const result =await roomCollection.insertOne(roomData)
      res.json(result);

    });

    app.get('/room/:id',verifyToken, async (req, res) => {
      const {id} = req.params
      const result  =  await roomCollection.findOne({_id: new ObjectId(id),

      })
      res.json(result)
    })

    app.patch("/room/:id", async (req, res) =>{
      const {id} = req.params
      const updatedData = req.body
      const result =await roomCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set:updatedData}
      )
      res.json(result)
    })


    app.delete("/room/:id", async(req, res) => {
      const {id} = req.params
      const result =await roomCollection.deleteOne({_id:new ObjectId(id)})
      res.json(result)
    })

    app.get('/booking/:userId', async (req, res) => {
      const {userId} = req.params
      const result = await bookingCollection.find({userId}).toArray()
      res.json(result)
    })

     app.post('/booking', verifyToken, async (req, res) => {
      const bookingData = req.body
      const result =await bookingCollection.insertOne(bookingData)
      res.json(result);

    });

    app.delete('/booking/:bookingId', async(req, res) => {
      const {bookingId} = req.params
      const result =await bookingCollection.deleteOne({_id:new ObjectId(bookingId)})
      res.json(result)
    })


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})