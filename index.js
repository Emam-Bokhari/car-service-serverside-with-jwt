
const express = require("express")
const cors = require("cors")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const port = process.env.PORT || 3000
const app = express()
require('dotenv').config()


// middleware
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

// car-service
// 4EGrNlaKv773bRdT
console.log(process.env.USER_DB);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.DB_PASS}@cluster0.kndeci6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// create middleware
const logger=async (req,res,next)=>{
  console.log('called',req.host,req.originalUrl);
  next()
}

const verifyToken=async (req,res,next)=>{
  const token=req.cookies?.token 
 console.log(token);
 if(!token){
  return res.status(401).send({message:'unathorized'})
 }
 jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
  if(err){
    return res.status(401).send({message:'unathorized'})
  }
  req.user=decoded
  next()
 })
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db("carServiceDB").collection("services")

    const carServicesCartCollection = client.db("carServiceDB").collection("carCart")

    // jwt token
    app.post("/jwt",async(req,res)=>{
      const user=req.body 
      console.log(user);
      const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
      const expirationDate=new Date()
      expirationDate.setDate(expirationDate.getDate()+7)
      res
      .cookie('token',token,{
        httpOnly:true,
        secure:false,
        expires:expirationDate

      })
      .send({success:true})
    })





    // read (display services data)
    app.get("/servicesData", async (req, res) => {
      const cursor = serviceCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // read (services data details)
    app.get("/servicesData/:id",logger, async (req, res) => {
      const id = req.params.id
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    
    // read (procced checkout)
    app.get("/checkout/:id",async(req,res)=>{
      const id=req.params.id 
      const query={_id:new ObjectId(id)}
      const options = {
        projection: { serviceName: 1, servicePrice: 1,photoURL:1 },
      };
      const result=await serviceCollection.findOne(query,options)
      res.send(result)
    })

    // create (add services data )
    app.post("/servicesData", async (req, res) => {
      const newService = req.body
      const result = await serviceCollection.insertOne(newService)
      console.log(newService);
      console.log(result);
      res.send(result)
    })


    // start(cart)
    // read(checkout)

    // read(specefic cart for specefic user)
    app.get("/booking",verifyToken,logger,async(req,res)=>{
      console.log(req.query.email);
      console.log('user in the valid token',req.user);
      // if(req.query.email!==req.user.email){
      //   return res.status(403).send({message:'forbidden'})
      // }
      if(req.query.email!==req.user.email){
        return res.status(403).send({message:'forbidden'})
      }
      let query={}
      if(req.query.email){
        query={email:req.query.email}
      }
      console.log(query);
      const result=await carServicesCartCollection.find(query).toArray()
      res.send(result)
    })


// create
    app.post("/booking",async(req,res)=>{
      const newBookings=req.body 
      // console.log(newBookings);
      const result=await carServicesCartCollection.insertOne(newBookings)
      res.send(result)
    })


    // update
    app.patch("/booking/:id",async(req,res)=>{
      const id=req.params.id
      const updatedBooking=req.body
      const query={_id:new ObjectId(id)}
      const update={
        $set:{
          Status:updatedBooking.status
        }
      }
      const result=await carServicesCartCollection.updateOne(query,update)
      res.send(result)
    })

    // app.get("/cart/:email", async (req, res) => {
    //   const email = req.params.email
    //   const query = { email: email }
    //   const cursor=carServicesCartCollection.find(query)
    //   const result=await cursor.toArray()
    //   res.send(result)
    // })


    // create (add to cart)
    // app.post("/cart", async (req, res) => {
    //   const newCart = req.body
    //   const result = await carServicesCartCollection.insertOne(newCart)
    //   res.send(result)
    // })

    // delete (my cart)
    // app.delete("/cart/:id",async(req,res)=>{
    //   const id=req.params.id 
    //   const query={_id:new ObjectId(id)}
    //   const result=await carServicesCartCollection.deleteOne(query)
    //   res.send(result)
    // })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Car service server is running...")
})

app.listen(port, (req, res) => {
  console.log(`port${port}`);
})