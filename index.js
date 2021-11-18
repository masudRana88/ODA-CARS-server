const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://oda_car:EvTovHi2ExitXrAp@cluster0.zgxio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("ODA_CAR");
    const car_collection = database.collection("car_collection");
    const order_collection = database.collection("order_collection");
    const user_collection = database.collection("user_collection");
    const review_collection = database.collection("review_collection");
    
    // get all car
    app.get("/allcar", async (req, res) => {
      const allCar = car_collection.find({});
      const result = await allCar.toArray()
      res.json(result)
    })
    // get car buy id name 
    app.get("/car/:id", async (req, res) => {
      const idName = req.params.id
      const query = { _id: ObjectId(idName) };
      const car = await car_collection.findOne(query);
      res.json(car)
    })
    // add a cars
    app.post("/uplodcar", async(req, res) => {
      const car = req.body;
      const result = await car_collection.insertOne(car);
      res.json(result)
    });
    // update a car
    app.patch("/car/:id", async (req, res) => {
      const data = req.body
      const id = req.params.id;
      const quary = { _id: ObjectId(id) }
      const upData = {
        $set: {
          model: `${data.model}`,
          price: `${data.price}`,
          discription: `${data.discription}`,
          img: `${data.img}`
        },
      };
      const result = await car_collection.updateOne(quary, upData)
      res.json(result)
    })
    // delete a car
    app.delete("/car/:id", async (req, res) => {
      const idName = req.params.id
      const query = { _id: ObjectId(idName) };
      const result = await car_collection.deleteOne(query)
      res.json(result)
    })
    // add Order 
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await order_collection.insertOne(order);
      res.json(result)

    })
    // delete Order 
    app.delete("/order/:id", async (req, rsc)=>{
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await order_collection.deleteOne(filter)
      rsc.json(result)
    })
    // update Order
    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const status = req.body.status
      const update = {
        $set :{
          status : `${status}`
        }
      }
      const result = await order_collection.updateOne(filter, update)
      res.json(result)
    })
    // get all order
    app.get('/order', async (req, res) => {
      const allOrder = order_collection.find({});
      const result = await allOrder.toArray()
      res.json(result)
    })
    // get order by email
    app.get('/order/:email', async (req, res) => {
      const email = req.params.email;
      const cursor = order_collection.find({})
      const result = await cursor.toArray()
      const allData = result.filter(rs => rs.email === email);
      res.json(allData)
      
    })
    // add user 
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await user_collection.insertOne(user);
      res.json(result)
    })
    // get user 
    app.get('/user/:email', async (req, res) => {
      const userEmail = req.params.email;
      const filter = { email: userEmail };
      const result = await user_collection.findOne(filter)
      res.json(result)
    })
    // make admin
    app.put("/user/:email", async (req, res) => {
      const userEmail = req.params.email;
      const filter = { email: userEmail };
      const update = {
        $set :{
          role : "admin"
        }
      }
      const result = await user_collection.updateOne(filter, update)
      res.json(result)
    })
    // Add comment 
    app.post("/reviews", async (req, res) => {
      const review = req.body
      const result = await review_collection.insertOne(review)
      res.json(result)
    })
    // get all comment
    app.get('/reviews', async (req, res) => {
      const reviews = review_collection.find({});
      const result = await reviews.toArray()
      res.json(result) 
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Oda-Car server is running');
});

app.listen(port, ()=> {
  console.log('Server running on port', port)  
})
