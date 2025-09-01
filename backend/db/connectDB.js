const { config } = require("dotenv")
const mongoose = require("mongoose")
require('dotenv').config();

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mydb')
       // 'mongodb://127.0.0.1:27017/sportify'
        console.log("mongo db connected")
    } catch (error) {
        console.log("error connection to Mongo db", error.message)
        process.exit(1)
    }
}
module.exports = connectDB;