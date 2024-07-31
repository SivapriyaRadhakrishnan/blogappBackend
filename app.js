const Express = require("express")
const Mongoose = require("mongoose")
const Jwt = require("jsonwebtoken")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const userModel=require("./models/uers")
const postModel = require("./models/post")


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

//create a post
app.post("/create",async(req,res)=>{
    let input=req.body
    let token =req.headers.token
    //need to verify while creating a post pr else anyone can post anything 
    Jwt.verify(token,"blogapp",async(eroor,decoded)=>{
        if (decoded && decoded.email) {
           let result= new postModel(input)//if authentication sucess
            await result.save()
            res.json({"status":"success"})
        } else {
            res.json({"status":"Invalid authentication"})
        }
    })
    })

    //viewALL
app.post("/viewall",(req,res)=>{
    let token=req.headers.token
    Jwt.verify(token,"blogapp",(error,decoded)=>{
    if (decoded && decoded.email) {
        postModel.find().then(
            (items)=>{
                res.json(items)
            }
        ).catch(
            (error)=>{
                res.json({"status":"error"})
            }
        )
    } else {
        res.json({"status":"invalid authorization"})
    }
    })
    })
    

app.listen(3030,()=>{
    console.log("Server started")
})