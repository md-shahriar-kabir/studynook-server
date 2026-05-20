// // const dns = require("node:dns");
// // dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const express = require('express')
// const dotenv = require('dotenv')
// const cors = require('cors')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
// dotenv.config()

// const uri = process.env.MONGODB_URI;

// const app = express()
// const port = process.env.port;

// app.use(cors())
// app.use(express.json())

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// const JWKS = createRemoteJWKSet(
//   new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
// )

// const verifyToken = async (req, res, next) =>{
//   const authHeader = req?.headers?.authorization
//   if(!authHeader){
//     return res.status(401).json({message:"Unauthorized"});
//   }
//   const token = authHeader.split(" ")[1];
//   console.log(token)

//   if(!token){
//     return res.status(401).json({message:"Unauthorized"});
//   }
  
//   try {
//     const {payload} = await jwtVerify(token, JWKS)
//   console.log(payload)
//    next()
//   } catch (error) {
//     return res.status(403).json({message: "Forbidden"});
//   }
  
// }

// async function run() {
//   try {
//     // await client.connect();

//     const db = client.db("studynook")
//     const roomCollection = db.collection("rooms")
//     const bookingCollection = db.collection("bookings")

//     app.get('/featured', async(req, res) =>{
//       const result = await roomCollection.find().limit(4).toArray()
//       res.json(result)
//     })

//     app.get('/room', async (req, res) => {
//       const result = await roomCollection.find().toArray()
//       res.json(result);
//     })

//     app.post('/room', async (req, res) => {
//       const roomData = req.body
//       const result =await roomCollection.insertOne(roomData)
//       res.json(result);

//     });

//     app.get('/room/:id',verifyToken, async (req, res) => {
//       const {id} = req.params
//       const result  =  await roomCollection.findOne({_id: new ObjectId(id),

//       })
//       res.json(result)
//     })

//     app.patch("/room/:id", async (req, res) =>{
//       const {id} = req.params
//       const updatedData = req.body
//       const result =await roomCollection.updateOne(
//         {_id: new ObjectId(id)},
//         {$set:updatedData}
//       )
//       res.json(result)
//     })


//     app.delete("/room/:id", async(req, res) => {
//       const {id} = req.params
//       const result =await roomCollection.deleteOne({_id:new ObjectId(id)})
//       res.json(result)
//     })

//     app.get('/booking/:userId', async (req, res) => {
//       const {userId} = req.params
//       const result = await bookingCollection.find({userId}).toArray()
//       res.json(result)
//     })

//      app.post('/booking', verifyToken, async (req, res) => {
//       const bookingData = req.body
//       const result =await bookingCollection.insertOne(bookingData)
//       res.json(result);

//     });

//     app.delete('/booking/:bookingId',verifyToken, async(req, res) => {
//       const {bookingId} = req.params
//       const result =await bookingCollection.deleteOne({_id:new ObjectId(bookingId)})
//       res.json(result)
//     })


//     // await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const {
  createRemoteJWKSet,
  jwtVerify,
} = require("jose-cjs");

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();

const port = process.env.port;

app.use(cors());

app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      JWKS
    );

    console.log(payload);

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden" });
  }
};

async function run() {
  try {
    // await client.connect();

    const db = client.db("studynook");

    const roomCollection =
      db.collection("rooms");

    const bookingCollection =
      db.collection("bookings");

    // ===============================
    // FEATURED ROOMS
    // ===============================

    app.get("/featured", async (req, res) => {
      const result = await roomCollection
        .find()
        .limit(4)
        .toArray();

      res.json(result);
    });

    // ===============================
    // GET ALL ROOMS
    // ===============================

    app.get("/room", async (req, res) => {
      const result = await roomCollection
        .find()
        .toArray();

      res.json(result);
    });

    // ===============================
    // ADD ROOM
    // ===============================

    app.post("/room", async (req, res) => {
      const roomData = req.body;

      const result =
        await roomCollection.insertOne(
          roomData
        );

      res.json(result);
    });

    // ===============================
    // GET SINGLE ROOM
    // ===============================

    app.get(
      "/room/:id",
      verifyToken,
      async (req, res) => {
        const { id } = req.params;

        const result =
          await roomCollection.findOne({
            _id: new ObjectId(id),
          });

        res.json(result);
      }
    );

    // ===============================
    // UPDATE ROOM
    // ===============================

    app.patch(
      "/room/:id",
      async (req, res) => {
        const { id } = req.params;

        const updatedData = req.body;

        const result =
          await roomCollection.updateOne(
            {
              _id: new ObjectId(id),
            },
            {
              $set: updatedData,
            }
          );

        res.json(result);
      }
    );

    // ===============================
    // DELETE ROOM
    // ===============================

    app.delete(
      "/room/:id",
      async (req, res) => {
        const { id } = req.params;

        const result =
          await roomCollection.deleteOne({
            _id: new ObjectId(id),
          });

        res.json(result);
      }
    );

    // ===============================
    // GET USER BOOKINGS
    // ===============================

    app.get(
      "/booking/:userId",
      async (req, res) => {
        const { userId } = req.params;

        const result =
          await bookingCollection
            .find({ userId })
            .toArray();

        res.json(result);
      }
    );

    // ===============================
    // CREATE BOOKING + CONFLICT CHECK
    // ===============================

    app.post(
      "/booking",
      verifyToken,
      async (req, res) => {
        const bookingData = req.body;

        const {
          roomId,
          date,
          startTime,
          endTime,
        } = bookingData;

        // Check Existing Booking Conflict
        const existingBookings =
          await bookingCollection
            .find({
              roomId,
              date,
              status: "confirmed",
            })
            .toArray();

        // Convert Time Function
        const convertToHour = (time) => {
          return Number(time.split(":")[0]);
        };

        const newStart =
          convertToHour(startTime);

        const newEnd =
          convertToHour(endTime);

        // Conflict Check
        const hasConflict =
          existingBookings.some((booking) => {
            const existingStart =
              convertToHour(
                booking.startTime
              );

            const existingEnd =
              convertToHour(
                booking.endTime
              );

            return (
              newStart < existingEnd &&
              newEnd > existingStart
            );
          });

        // If Conflict Found
        if (hasConflict) {
          return res.status(409).json({
            success: false,
            message:
              "This room is already booked for the selected time slot.",
          });
        }

        // Save Booking
        const result =
          await bookingCollection.insertOne(
            bookingData
          );

        res.status(201).json({
          success: true,
          message:
            "Room booked successfully!",
          insertedId: result.insertedId,
        });
      }
    );

    // ===============================
    // CANCEL BOOKING
    // ===============================

    app.delete(
      "/booking/:bookingId",
      verifyToken,
      async (req, res) => {
        const { bookingId } = req.params;

        const result =
          await bookingCollection.deleteOne({
            _id: new ObjectId(
              bookingId
            ),
          });

        res.json(result);
      }
    );

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}`
  );
});