const Express = require("express")
const Mongoose = require("mongoose")
const Jwt = require("jsonwebtoken")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const userModel=require("./models/uers")


let app= Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://siva:6282615940@cluster0.lqoh3rx.mongodb.net/blogAppnewdb?retryWrites=true&w=majority&appName=Cluster0")
//SIGNUP
app.post("/signUp",(req,res)=>{
    let input=req.body
    let hashedPassword=Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password=hashedPassword
    userModel.find({email:req.body.email}).then(
        (items)=>{
            if(items.length>0)
            {
                res.json({"status":"Email id already existing"})
            }
            else{
                let result=new userModel(input)
                result.save()
                res.json({"status":"Success"})
            }
        }
    ).catch(
        (error)=>{

        }
    )

})
app.listen(3030,()=>{
    console.log("Server started")
})