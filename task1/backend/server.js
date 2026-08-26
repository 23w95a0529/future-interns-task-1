const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contact");
const projectRoutes = require("./routes/projects");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
  res.json({message:"Portfolio API is running."});
});

app.get("/api/health",(req,res)=>{
  res.json({status:"OK",message:"Server is healthy."});
});

app.use("/api/contact",contactRoutes);
app.use("/api/projects",projectRoutes);

app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});