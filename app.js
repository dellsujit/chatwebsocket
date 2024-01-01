const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000
const server = app.listen(PORT,()=> console.log(`server on ${PORT}`))


const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname,'public')));



let socketsConnected = new Set()
io.on('connection',onConnected)
function onConnected(socket)
{
    socketsConnected.add(socket.id)
    io.emit('clients-total',socketsConnected.size)

    ////////Diconnect 
    socket.on('disconnect',()=>
    {
        console.log('Socket Disconnected',socket.id)
        socketsConnected.delete(socket.id);
        io.emit('clients-total',socketsConnected.size)
    })

    ////broadcast Message
    socket.on('message',(data)=>
    {
        socket.broadcast.emit('chat-message',data)

    })
    /////feedback i.e user tying
    socket.on('feedback',(data)=>
    {        
      socket.broadcast.emit('feedback',data)
    
    })
}