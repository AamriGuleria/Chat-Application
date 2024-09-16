import React, { useState, useEffect } from 'react'
import "./App.css"
import ScrollToBottom from "react-scroll-to-bottom"
import Picker from 'emoji-picker-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Chat = ({ socket, username, room, bitmoji }) => {
  const [message, setmessage] = useState("")
  const [messagelist, setmessagelist] = useState([])
  const [liveUsers,setLiveUsers]=useState([])
  const [showPicker,setShowPicker]=useState(false);
  const Sound=new Audio('/notification-pretty-good.mp3')
  const send=new Audio('/send.wav')
  const receive=new Audio('/receive.mp3')
  const sendMessage = async () => {
    if (message !== "") {
      var today = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })
      const option = {
        author: username,
        room: room,
        context: message,
        time: today,
        link: bitmoji
      }
      await socket.emit("send_data", option);
      setmessagelist((list) => [...list, option])
      setmessage("")
      send.play();
    }
  }
  const handleNotification = (text) => {
    Sound.play();
    toast.info(text);
  };

  useEffect(() => {
    const handleReceiveData = (data) => {
      setmessagelist((list) => [...list, data]);
      receive.play();
    };

    // Handler for live users update
    const handleLiveUsers = (usernames) => {
      setLiveUsers(usernames);
    };

    // Set up socket event listeners
    socket.on("receive_data", handleReceiveData);
    socket.on("live-users", handleLiveUsers);
    socket.on("user_notification",handleNotification)
    // Clean up event listeners on component unmount or when socket changes
    return () => {
      socket.off("receive_data", handleReceiveData);
      socket.off("live-users", handleLiveUsers);
    };
  }, [])

  const emoji=(event,emojiObject)=>{
    setmessage(prev=>prev+event.emoji);
    setShowPicker(false);
  }
  return (
    <center>
      <div className="whole">
      <ToastContainer />
        <div className="main-container">
          <div className="heading">
            <h4>ChatSphere</h4>
          </div>
          <div className="your-chat">
            <ScrollToBottom className="my-chat">
              {
                messagelist.map((ele) => {
                  return (
                    <>
                      <div id={username === ele.author ? "its-me" : "its-you"}>
                        <div className="pic">
                          <img src={ele.link} width="20px" height="20px" className="pick"></img>
                        </div>
                        <div>
                          {ele.context}
                        </div>
                        <p className="venue">
                          <span id="sender">{ele.author}</span>
                          <span id="timings">{ele.time}</span>
                        </p>
                      </div>
                    </>
                  )
                })
              }
            </ScrollToBottom>
          </div>
          <div className="footer">
          <img className="emoji-icon" src="https://img.freepik.com/free-photo/3d-rendering-emotions_23-2149081943.jpg?w=996&t=st=1693915752~exp=1693916352~hmac=520b6ba6a60c01a082f1b6a721e67b2ac3ba1783e243aedbad92d8f2a1c3b9c2" width="30px" height="30px" onClick={()=>{setShowPicker(val=>!val)}}/>
            <input type="text" id="input-message" placeholder="Send Message..." value={message} onChange={(e) => setmessage(e.target.value)} />
            <button type="submit" id="button" onClick={sendMessage} onKeyPress={(e) => { e.key === "Enter" && sendMessage(); }}><img src="https://cdn-icons-png.flaticon.com/128/3682/3682321.png" alt="not found" height="33px" width="30px"></img></button>
          </div>
          <div className="em">
            {showPicker && <Picker
            height="20rem" width="100%"
            pickerStyle={{}}
            onEmojiClick={emoji}/>}
          </div>
        </div>
        <div className="Live">
        <h2>Live Users</h2>
        <ul>
          {liveUsers.map((username, index) => (
            <li key={index}>{username}</li>
          ))}
        </ul>
      </div>
      </div>
    </center>
  )
}

export default Chat
