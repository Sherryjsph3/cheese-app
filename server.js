//==========DEPENDENCIES==========
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 5000, MONGODB_URL } = process.env;
//import express
const express = require("express");
//create application object
const app = express();
//import mongoose
const mongoose = require("mongoose");
//import cors and morgan
const cors = require("cors");
const morgan = require("morgan");

//==========Database Connection===========
//Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//connection Events = placing event listeners on specific events
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error))

//==========Model==========
const CheeseSchema = new mongoose.Schema({
    name: String,
    coutryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema);

//==========Middleware==========
//sits in the middle of that request and response
app.use(cors()); // to prevent cors errors, open  access to all origins
app.use(morgan("dev")); //logging -- level of logging we want 
app.use(express.json()); //parse json bodies

//==========Routes============

// create a root route
app.get("/", (req, res) => {
    res.send("test cheese app");
});

//cheese index route
app.get("/cheese", async (req, res) => {
    try {
        // send all people
        res.json(await Cheese.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//delete cheese route
app.delete("/cheese/:id", async (req, res) => {
    try {
      // send all people
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

//update cheese route
app.put("/cheese/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  

//create cheese route
app.post("/cheese", async (req, res) => {
    try {
        // send all people
        res.json(await Cheese.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});
//Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))