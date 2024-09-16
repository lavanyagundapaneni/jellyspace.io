const {Client} =require('pg')

const client=new Client({
    host:'localhost',
    port:5432,
    database:'study',
    user:'postgres',
    password:'123456',
})

client.connect((err)=>{
    if(err)
    {
        console.log("Connection Error",err.stack)
    }
    else{
        console.log("Connected")
    }
})

module.exports=client;