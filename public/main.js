//const socket = io("http://localhost:4000",{})
const io = require('socket.io')(server);
const socket = io("https://chatwebsocket-git-main-dellsujits-projects.vercel.app");
const messagetone = new Audio('/tone.mp3')
const clinettotal = document.getElementById('clients-total');
const messagcontainer = document.getElementById('message-container');
const nameinput = document.getElementById('name-input')
const messageForm = document.getElementById('messgage-form')
const messageInput = document.getElementById('message-input')
socket.on('clients-total',(data)=>
{
    clinettotal.innerText = `Total clients:${data}`
})

messageForm.addEventListener('submit',(e)=>
{
   e.preventDefault()
   sendMessage() 
})


///Send own message from others
function sendMessage()
{

    if(messageInput.value === '')return
    const data = 
    {
        name:nameinput.value,
        message:messageInput.value,
        dataTime:new Date()
    }
socket.emit('message',data)
addMessageToUI(true,data);
messageInput.value = '';

}

///Receiving message from others
socket.on('chat-message',(data)=>
{
 messagetone.play();
 addMessageToUI(false,data);
})


function addMessageToUI(isownmessage,data)
{
    clearfeedback()
    const element = `<li class="${isownmessage ? "message-right":"message-left"}">
            <p class="message">
            ${data.message}
            <span>${data.name} ${moment(data.dataTime).fromNow()}</span>
            </p>
        </li>`

        messagcontainer.innerHTML += element;
        scrollToBottom();
}
function scrollToBottom()
{
    messagcontainer.scrollTo(0,messagcontainer.scrollHeight);
}
messageInput.addEventListener('focus',(e)=>
{
socket.emit('feedback',{
    feedback:`${nameinput.value} is typing a message`
})
})
messageInput.addEventListener('keypress',(e)=>
{
    socket.emit('feedback',{
        feedback:`${nameinput.value} is typing a message`
    })
    
})
messageInput.addEventListener('blur',(e)=>
{
    socket.emit('feedback',{
        feedback:``
    })

})

socket.on('feedback',(data)=>
{
    clearfeedback()
    const element  = `<li class="message-feedback">
    <p class="feedback" id="feedback">
    ${data.feedback}
    </p>
 </li>`

 messagcontainer.innerHTML += element;

})

function clearfeedback()
{
    document.querySelectorAll('li.message-feedback').forEach(element=>
        {
            element.parentNode.removeChild(element);
        })
}