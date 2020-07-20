const input = document.getElementById('inputfile');
const output = document.getElementById('output');
let selectedUsers = null;

const localStorageKey = "saved-messages"
const savedList = document.querySelectorAll("div#input-options ul")[0]


const extractMessages = data => {
    const users = {};
    const messages = []

    const lines = data.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // If the line does't start with a date, it's probably not a message
        if (!line.match(/^[0-9]+[/][0-9]+[/][0-9]+/)) continue;

        // Get date
        const slIndex = line.indexOf("-");
        const dateString = line.substr(0, slIndex - 7);
        const date = new Date(dateString);

        let tempLine = line.substr(slIndex + 2)

        // Username
        const colIndex = tempLine.indexOf(":")
        const username = tempLine.substr(0, colIndex)

        // Add username to collection if it doesn't already exist
        if (!users[username]) users[username] = username

        // Message
        const message = tempLine.substr(colIndex + 2)

        messages.push({
            username,
            message,
            date
        })
    }

    // saveMessages(users, messages);
    showMessages(users, messages);
    populateSavedLists();
}

const showMessages = (users, messages, DesiredselectedUser = null) => {
    // Clear page
    window.scrollTo(0, 0)

    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }

    // Select user
    const availableUsers = Object.keys(users).filter(username => username != "");

    let selectedUser = null;
    while (!selectedUser) {
        const answer = parseInt(window.prompt(
            `Which user would you like to select?\n${
                availableUsers.map((username, i)=> `${i+1} - ${username}`).join("\n")
            }`
        ))


        if (answer > 0 && answer <= availableUsers.length) {
            selectedUser = availableUsers[answer - 1]
        }
    }

    let lastUser = null;

    for (let i in messages) {
        const message = messages[i];

        const msg = document.createElement("div");

        if (message.username != lastUser) {
            const usernameTag = document.createElement("b");
            msg.appendChild(usernameTag);
            usernameTag.innerText = message.username

            lastUser = message.username
        }

        const msggText = document.createElement("p");
        msg.appendChild(msggText);
        msggText.innerText = message.message

        if (message.username == selectedUser)
            msg.classList.add("user")

        output.appendChild(msg)
    }
}

const populateSavedLists = () => {
    while (savedList.firstChild) {
        savedList.removeChild(savedList.firstChild);
    }

    const saved = JSON.parse(localStorage.getItem(localStorageKey));

    if (!saved || !saved instanceof Array) return;

    saved.forEach(conversation => {
        const li = document.createElement("li");

        li.innerText = conversation.title;
        li.id = conversation.id;

        savedList.appendChild(li)
    });
}

input.addEventListener('change', function () {
    const fileReader = new FileReader();

    fileReader.onload = () => {
        extractMessages(fileReader.result);
        console.log(fileReader)
    }

    fileReader.readAsText(this.files[0]);
})

savedList.addEventListener("click", e => {
    const id = e.target.id
    const saved = JSON.parse(localStorage.getItem(localStorageKey));

    const conversation = saved.find(conversation => conversation.id == id);

    console.log(conversation)

    showMessages(conversation.users, conversation.messages);
})

populateSavedLists()