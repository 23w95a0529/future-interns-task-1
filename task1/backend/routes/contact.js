const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req,res)=>{
  const {name,email,subject,message}=req.body;
  if(!name || !email || !subject || !message){
    return res.status(400).json({message:"Please fill all fields."});
  }
  try{
    await db.execute(
      "INSERT INTO contact_messages (name,email,subject,message) VALUES (?,?,?,?)",
      [name,email,subject,message]
    );
    res.status(201).json({message:"Thank you! Your message was sent successfully."});
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Database error. Please try again."});
  }
});

module.exports=router;