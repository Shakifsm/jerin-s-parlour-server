const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
// const { static } = require('express');
// const fileUpload = require('express-fileupload');
require('dotenv').config();


const port = process.env.PORT || 5000


app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('services'));
// app.use(fileUpload())


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhonm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority;`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("jerin's-parlour").collection("services");
  
  app.post('/addAService', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count :', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  const reviewsCollection = client.db("jerin's-parlour").collection("reviews");

  app.post('/addAReview', (req, res) => {
    const newReview = req.body;
    reviewsCollection.insertOne(newReview)
      .then(result => {
        console.log('inserted count :', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/reviews', (req, res) => {
    reviewsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })




});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
