const elementId = (id) => {
    return document.getElementById(id);
}
const elementClass = (clss) => {
    return document.querySelector(clss)
}
const createElem = (element) => {
    return document.createElement(element);
}
const getTimeAndDate = (date) => (
    `${date.split(' ')[4]}`
) 
//elements by id
const loginBtn = elementId('login');
const username = elementId('username');
const password = elementId('password');
const form = elementId('form');
const status = elementId('status');
const input = elementId('input');
const chats = elementId('chats');

//elements by class name
const formContainer = elementClass('.form-container');
const chatContainer = elementClass('.chat-container');
let socket;

let usernameValue;
let passwordValue;
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!username.value || !password.value) {
        console.log('error');
        return;
    }

    //hides login form
    formContainer.style.display = 'none';
    //displays chat area
    chatContainer.removeAttribute('hidden');
    usernameValue = username.value;
    passwordValue = password.value;


    socket = io('http://localhost:7000');
    socket.emit('loggedIn', { usernameValue, passwordValue });
    socket.on('welcome', (data) => {
        status.textContent = data.msg;
        setTimeout(() => {
            status.style.display = 'none';
        }, 2000);
    });

    //start chat
    input.addEventListener('keydown', (e) => {
        // socket.emit('chat', { conversation });
        if (e.key === 'Enter' && e.shiftKey === false) {
            socket.emit('chat', { usernameValue,conversation: e.target.value });
            //clears the input area
            e.target.value = '';
            e.preventDefault();
        }
    });

    socket.on('conversation', (data) => {
        if (socket.id === data.id) {
            const div = createElem('div');
            const span = createElem('span');
            div.setAttribute('class', 'author');
            span.textContent = data.author;
            span.setAttribute('class', 'authorLeft');
            chats.appendChild(span);
            div.textContent = data.conversation+'\n'+getTimeAndDate(Date());
            chats.appendChild(div);
            return;
        }
        const div = createElem('div');
        const span = createElem('span');
            span.textContent = data.author;
            chats.appendChild(span);
            div.setAttribute('class', 'conversation');
            div.textContent = data.conversation+'\n'+getTimeAndDate(Date());
            chats.appendChild(div);
    })
});