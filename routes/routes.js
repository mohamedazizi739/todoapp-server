const express=require('express')
const axios=require('axios')
const bcrypt = require('bcrypt');
require("dotenv").config();
const user=require('../models/user.js')
const router = express.Router();
var jwt = require('jsonwebtoken');
const authorization=require('../middlewares/auth.js')
// new user register
router.post('/register',async(req,res)=>{
 const {email,name,password}=req.body;
 const userSearch=await user.findOne({email:email}).exec();
 if(userSearch){return res.status(400).json({msg:'user already exsist'})}
 try {
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt)
   await user.create({ name,email,password:hash })
   res.json({msg:'user is registred' })
 } catch (error) {
      res.status(500).json({msg:'user register failed',err:error})

 }

})

// user login
router.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  try {
  const userSearch=await user.findOne({email:email}).exec()
  if(!userSearch){return res.status(401).json({msg:"User  is not registred"}
  )}
  const passwordCheck=await bcrypt.compare(password, userSearch.password)
  if(!passwordCheck){return res.status(401).json({msg:"Password not correct"})}
  const token=await jwt.sign({email},process.env.tokenKey, { expiresIn: '300h' });
  res.json({token:token})
  } catch (error) {
   res.status(502).json({msg:"login failed"})
  }
})
// authorisation
router.post('/auth',authorization,(req,res)=>{
  res.json({msg:true})

})
// get tasks data
router.get('/task',authorization,async(req,res)=>{
  try {
  const {email}=req.user
  const data=await user.findOne({ email: email }).exec()
  const resTasks=await data.tasks.reverse()
  res.json({tasks:resTasks,name:data.name})
  } catch (error) {
    res.status(501).json({msg:"get tasks failed"})
  }
})
// add task for user
router.post('/task',authorization,async(req,res)=>{
 try {
  const {email}=req.user
  const task=req.body
  await user.findOneAndUpdate({email},{$push: { "tasks": task }})
  res.json({msg:"task added"})

  } catch (error) {
  res.status(501).json({msg:"add task failed"})
 }
})
// update task
router.put('/task',authorization,async(req,res)=>{
 try {
  const {email}=req.user
  const task=req.body
  await user.updateOne(
    { "email": email, "tasks._id": task.id },
    {
        $set: {
            "tasks.$.taskName": task.taskName
         }
    }
)
   res.send("task updated")
  } catch (error) {
  res.status(501).json({msg:"update failed"})
 }
})
// delete task
router.delete('/task',authorization,async(req,res)=>{
 try {
  const {email}=req.user
  const task=req.body
  await user.findOneAndUpdate({email},{$pull: { "tasks": {_id:task.id} }})
  res.json({msg:"task deleted"})

  } catch (error) {
  res.status(501).json({msg:"delete task failed"})
 }
})
//user login facebook
router.post('/loginf',async(req,res)=>{
  const {id,token}=req.body;
  try {
  const data=await axios.get(`https://graph.facebook.com/${id}?fields=email,name&access_token=${token}`).then(res=>res.data)
  const name=data.name
  const email=data.email+"+facebook+(!£$.;Azet})"
   const userSearch=await user.findOne({email:email}).exec()
  if(userSearch){
  const token=await jwt.sign({email:email},process.env.tokenKey, { expiresIn: '300h' });
  return res.status(201).json({token:token}


   )}
  const password=email+"!123;(ty)"
  console.log(password)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt)
  await user.create({ name:name,email:email,password:hash })
  const token2=await jwt.sign({email:email},process.env.tokenKey, { expiresIn: '300h' });
  return res.json({token:token2})
   } catch (error) {
   res.status(502).json({msg:"facebook login failed",error:error})
  }
})
// fbApi
router.get('/fbApi',(req,res)=>{
  res.json({fbApi:process.env.fbApi})
})

module.exports=router