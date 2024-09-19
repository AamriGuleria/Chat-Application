import './App.css';
import React, { useState } from 'react';
import io from "socket.io-client"
import Chat from "./Chat.js"
const socket=io.connect("https://chat-application-backend-ipic.onrender.com/")
function App() {
  const [state,setstate]=useState(false)
  const [username,setusername]=useState("")
  const [room,setroom]=useState("")
  const [link,setlink]=useState("https://cdn.vectorstock.com/i/1000x1000/11/72/outline-profil-user-or-avatar-icon-isolated-vector-35681172.webp")
  const HandleSelection=()=>{
    if(username!==""&&room!==""){
      socket.emit("join_room",room,username,link);
      setstate(true);
    }
  }
  const setMoji=(link)=>{
    setlink(link);
  }
  return (
    <>
    <div className="App">
      {!state?
      (
      <div className='log'>
      <center>
      <div className="joinChat">
      <p className="heading1">ChatSphere</p>
      <input type="text" id="input-name" onChange={(e)=>setusername(e.target.value)} placeholder="Your Name..." maxlength="10" required />
      <input type="text" id="input-room" onChange={(e)=>setroom(e.target.value)} placeholder="Room Id..." required/>
      <div className="grid">
        <h4>Select a bitmoji</h4>
        <center>
        <img src="https://clipart-library.com/images/yckKy5Bzi.png" className="emoji" width="45px" height="45px" onClick={()=>setMoji("https://clipart-library.com/images/yckKy5Bzi.png")}></img>
        <img src="https://clipart-library.com/images/BTg4X7ET8.png" className="emoji" width="45px" height="45px" onClick={()=>setMoji("https://clipart-library.com/images/BTg4X7ET8.png")}></img>
        <img src="http://clipart-library.com/images/ATbbrXoRc.png" className="emoji" width="45px" height="45px" onClick={()=>setMoji("http://clipart-library.com/images/ATbbrXoRc.png")}></img>
        <img src="https://clipart-library.com/images/pc78y5Gqi.jpg" className="emoji" width="45px" height="45px" onClick={()=>setMoji("https://clipart-library.com/images/pc78y5Gqi.jpg")}></img>
        <img src="http://clipart-library.com/images/rijrq9j8T.png" className="emoji" width="45px" height="45px" onClick={()=>setMoji("http://clipart-library.com/images/rijrq9j8T.png")}></img>
        <img src="http://clipart-library.com/image_gallery/269381.jpg" className="emoji" width="45px" height="45px" onClick={()=>setMoji("http://clipart-library.com/image_gallery/269381.jpg")}></img>
        </center>
      </div>
      <button className="submit" onClick={HandleSelection}>Join The Room</button>
    </div>
    </center>
    </div>)
    :
    (
      <Chat socket={socket} username={username} room={room} bitmoji={link}/>
    )
}
</div>
</>

)
}
export default App;
