let express = require("express");
let app = express();
let url = require("url");
let body_parser = require("body-parser");
// cros跨域
app.all("*",function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();  
});
app.use(body_parser.urlencoded({
    extended:false
}))
//引入mongoose模块
let mongoose = require("mongoose");
//连接数据库
mongoose.connect("mongodb://localhost/log",{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("连接数据库成功");
})
.catch((err)=>{
    console.log(err);
})
//设定集和规则
let userSchema = new mongoose.Schema({
    tel:String,
    pass:String
})
//创建集合
let user = mongoose.model("user",userSchema);
//注册接口
app.get("/register",(req,res)=>{
    let obj = url.parse(req.url,true).query;
    user.find({tel:obj.tel}).then(data=>{
        if(data.length==0){
            user.create(obj).then(result=>{
                result?res.end("注册成功"):res.end("注册失败");
            })
        }else{
            res.send({
                status:false,
                msg:"该手机号已注册，请直接登录"
            })
        }
    })
})
//登录接口
app.get("/login",(req,res)=>{
    user.find({
        tel:req.query.tel,
        pass:req.query.pass
    }).then(data=>{
        data.length==0?res.send({status:0,msg:"登录失败"}):res.send({status:1,msg:"登陆成功"});
    })
})
//退出接口

//设置监听
app.listen("3000",()=>{
    console.log("3000 is runing");
})