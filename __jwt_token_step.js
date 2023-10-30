/*
step:1 install jwt token and require
step:2 create post method 
step:3 client side theke user ar email ta pathao 
step:4 create token(jwt.sign(user,secret,{expiresIn:"1h"}))
step:5 res.send(token)


// generate token with proper way
step:1 open terminal and write node
step:2 require('crypto').randomBytes(64).toString('hex')
step:3 dotenv file a acceass token ta rakhte hobe
step:4 secret ar jaigai process.env.env file a daoua access token ar nam ta dite hobe


// cookies http only
step:1 install express cookie parser
step:2 set middleware express cokkie parser()
step:3 cokkie ta res ar modhe send kore dite hobe, 
.cokkie('akta nam dite hobe'token,{
    httpOnly:true,
    secure:false
})
res.send({success:true})


// server theke client side a cokkie ta set korar jonno
step:1 app.use(cors({
    origin:["http://localhost/5173"],
    credentials:true
}))
step:2 client side a o get,post etc. sobkiso te e azios ar por akta {withCredientials:true} kore dite hobe
step:3 onno onno jaigar cokkie gula paite hoile o client side a fetch use na kore axios use korte hobe, abong {withCredientails:true} kore dite hobe


// verify jwt token
step:1 akta varibale nite hobe abong async operation ar modhe 3ta parameter hobe async(req,res,next)=>{

}
step:2 token ta access korte hobe. const token=req.cookies.token
step:3 jadi token na thke tahule ta k r samne agaite dibo na , ta k object ar vitore akta status r  akta error message send kore return kore dibo
step:4 arpor verigy function ar madhome verify korte hobe, jwt.verigy() aitar vitore 3 ta parameter nibe akta hoceh token ar nam, secret token, r akta call back function oi call back function abar 2ta parameter nai jar akta hochhe err, decoded
example:jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{

})
step:5 ai callback function ar vitore amra moloto 2 ta kaj korbo ak jadi err hoi tahule akta kaj r jadi err na hoi tahule akta kaj 
step:6 jadi err hoi tahule amra akta status code r object ar vitore akta error message send kore dibo ja unathorized
step:6 jadi valid user hoi tahule amra req ar modhe req.user=decoded
next()

*/