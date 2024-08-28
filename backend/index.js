const express=require("express")
const app=express()
const http=require("http")
const cors=require("cors")
const {Server} =require("socket.io")

app.use(cors)

const server=http.createServer(app)

const io=new Server(server,
    {
        cors:{
            origin:"http://localhost:3000",
            methods:["GET","POST"]
        }
    }
    )
    const rooms={};
io.on("connection",(socket)=>{
    socket.on("join_room",(room,username,link)=>{
        socket.join(room);
        if(!rooms[room]){
            rooms[room]=[];
        }
        rooms[room].push({id:socket.id,username,link});
        io.to(room).emit("live-users",rooms[room].map(user=>user.username))
    })
    socket.on("send_data",(data)=>{ 
        console.log(data)
        socket.to(data.room).emit("receive_data",data)
    })
    socket.on("disconnect",()=>{
        for(const room in rooms){
            rooms[room]=rooms[room].filter(user=>user.id!==socket.id)
            if(rooms[room].length>0){
                io.to(room).emit("live-users",rooms[room].map(user => user.username))
            }
            else{
                delete rooms[room]
            }
        }
        console.log("user disconnected",socket.id)
    })
})
server.listen(3001,()=>{console.log("server running")})