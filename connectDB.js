const mongoose=require('mongoose')
require("dotenv").config();
const connectDB=()=>{
mongoose.connect(process.env.mongoUri, { useNewUrlParser: true }, { useUnifiedTopology: true },{useFindAndModify: true}).then(()=>console.log('mongoose is connected')).catch(()=>console.log('mongoose connection failed'))
}
module.exports = connectDB