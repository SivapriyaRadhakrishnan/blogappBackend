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

//SIGNIN
app.post("/signIn",async(req,res)=>{
    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
        (items)=>{
            if(items.length>0){
                const passwordvalidator=Bcrypt.compareSync(req.body.password,items[0].password)
                if(passwordvalidator)
                {
                    Jwt.sign({email:req.body.email},"blogapp"/*token name*/,{expiresIn:"1d"},
                        (error,token)=>{
                            if(error){
                                res.json({"status":"Error","errorMessage":error})
                            }
                            else{
                                res.json({"status":"SUCCESS","token":token,"userId":items[0]._id})
                            }
                        }
                    )
                }
                else{
                    res.json({"status":"INCORRECT PASSWORD"})
                }
            }
            else{
                res.json({"status":"INVALID EMAIL ID"})
            }
        }
    )
    })
    


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