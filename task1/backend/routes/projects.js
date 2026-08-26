const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req,res)=>{
  try{
    const [rows]=await db.execute("SELECT * FROM projects ORDER BY id DESC");
    res.json(rows);
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Unable to load projects."});
  }
});

router.post("/", async (req,res)=>{
  const {title,description,technologies,github_url,live_url}=req.body;
  if(!title || !description) return res.status(400).json({message:"Title and description are required."});
  try{
    const [result]=await db.execute(
      "INSERT INTO projects (title,description,technologies,github_url,live_url) VALUES (?,?,?,?,?)",
      [title,description,technologies||"",github_url||"",live_url||""]
    );
    res.status(201).json({id:result.insertId,message:"Project created."});
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Unable to create project."});
  }
});

module.exports=router;