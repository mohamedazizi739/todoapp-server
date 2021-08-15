const express=require('express')
const connectDB=require('./connectDB.js')
var cors = require('cors')
const app=express()
connectDB()
app.use(express.json());
app.use(cors())
app.use('/api',require('./routes/routes.js'))

const port=process.env.PORT||5000
app.listen(port,(err)=>{
 err?console.log('server connection failed'):
 console.log(`server is runing on port ${port}`)
})