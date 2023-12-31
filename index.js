const express =require('express');
const cors = require ('cors');
const app = express();
require('dotenv').config()
const port =process.env.PORT ||5000;
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());



console.log(process.env.DB_USER,process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0q7jo7.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const menuCollection = client.db("billing_Resturant").collection("menu");
    const checkoutCollection = client.db("billing_Resturant").collection("checkOut");


    //get the all menu    
  app.get('/menu',async(req,res)=>{
     const result = await menuCollection.find().toArray();
     console.log(result)
     res.send(result);
  })

  app.get('/checkout',async(req,res)=>{
    const result = await checkoutCollection.find().toArray();
    res.send(result);
 })
   // post menu
   app.post ('/menu',async(req,res)=>{
    const addFood = req.body;
    const result = await menuCollection.insertOne(addFood);
    // console.log(result)
    res.send(result);
   })
   app.post('/checkout',async(req,res)=>{
    const checkout=req.body;
    const result=await checkoutCollection.insertOne(checkout);
    res.send(result);
   })
  //delete menu
   app.delete('/menu/:id',async(req,res)=>{
    const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await menuCollection.deleteOne(query);
    
        res.send(result);
   })
  // update menu
  app.put('/menu/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
          name: body.name,
        price: body.price,
        quantity: body.quantity,
        image: body.image,
      },
    };
    const result = await menuCollection.updateOne(filter, updateDoc);
    console.log(result)
    res.send(result);
  });

///delete all payment history... 

app.delete('/checkout', async (req, res) => {
  try {
    const result = await checkoutCollection.deleteMany({});
    if (result.deletedCount > 0) {
      res.json({ message: 'All checkout records deleted successfully' });
    } else {
      res.status(404).json({ message: 'No checkout records found' });
    }
  } catch (error) {
    console.error('Error deleting checkout records:', error);
    res.status(500).json({ error: 'An error occurred while deleting checkout records' });
  }
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('user .......')
})
app.listen(port,()=>{
    console.log(`server is running on port:${port}`)
})