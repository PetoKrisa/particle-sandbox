const express = require("express")
const app = express()
const PORT = 8080

app.use("/", express.static("./"))

app.get("/", (req,res)=>{
    res.sendFile(`${__dirname}\\index.html`)
})
app.get("/main.js", (req,res)=>{
    res.sendFile(`${__dirname}\\main.js`)
})
app.get("/shuffle.js", (req,res)=>{
    res.sendFile(`${__dirname}\\shuffle.js`)
})
app.get("/ui.js", (req,res)=>{
    res.sendFile(`${__dirname}\\ui.js`)
})
app.get("/Cell.js", (req,res)=>{
    res.sendFile(`${__dirname}\\Cell.js`)
})
app.get("/index.css", (req,res)=>{
    res.sendFile(`${__dirname}\\index.css`)
})

app.listen(PORT, ()=>{
    console.log(`Server Listening: 'http://localhost:${PORT}'`)
})