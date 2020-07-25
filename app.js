// ------------------------------------------------------------------------------------------------------------------------
// DOM ELEMENTS
const input = document.getElementById('inputfile');
const output = document.getElementById('output');

const savedList = document.querySelectorAll("div#input-options ul")[0]

// ------------------------------------------------------------------------------------------------------------------------
// GLOBAL VARIABLES
const messagesPerPage = 100;
let offset = 0;
let messages = [];
let users = {};
let selectedUser = null;

// ------------------------------------------------------------------------------------------------------------------------
// EXTRACT MESSAGES FROM STRING (AND SAVE THEM)

const extractMessages = data => {
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

        // In case there was something wrong with the line we simply don't add it
        if (username && message && date)
            messages.push({
                username,
                message,
                date
            })
    }

    if (messages.length === 0 || users.length === 0) {
        alert("Couldn't extract anything from the file.");
        return false;
    }

    // Save messages in db
    try {
        // saveMessages(users, messages);
        // localStorage.setItem(localStorageKey, JSON.stringify(saved));
        add({
            title: `Conversation between ${Object.keys(users).join(" - ")}`,
            messages,
            users
        });

    } catch (error) {
        alert("Couldn't store messages, probably because the file is to big")
        console.error(error);
    }

    return true;
}

// ------------------------------------------------------------------------------------------------------------------------
// MANAGE DOM

const showMessages = (users, messages, offset) => {
    // Clear page if we are starting to show a new conversation
    if (offset == 0) {
        window.scrollTo(0, 0)

        while (output.firstChild) {
            output.removeChild(output.firstChild);
        }
    }

    // Select user
    if (!selectedUser) {
        const availableUsers = Object.keys(users).filter(username => username != "");

        while (!selectedUser) {
            const answer = parseInt(window.prompt(
                `Which user would you like to select?\n${
                availableUsers.map((username, i)=> `${i+1} - ${username}`).join("\n")
            }`
            ))

            if (!answer) return;

            if (answer > 0 && answer <= availableUsers.length) {
                selectedUser = availableUsers[answer - 1]
            }
        }
    }

    // Show users
    let lastUser = null;
    const limit = offset + messagesPerPage < messages.length ? offset + messagesPerPage : messages.length;

    for (let i = offset; i < limit; i++) {
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

const populateSavedLists = async () => {
    while (savedList.firstChild) {
        savedList.removeChild(savedList.firstChild);
    }

    const saved = await readAll();

    if (!saved || !saved instanceof Array || saved.length == 0) return;

    for (let i = 0; i < saved.length; i++) {
        const conversation = saved[i];

        const li = document.createElement("li");

        li.innerText = conversation.title;
        li.id = i + 1;

        savedList.appendChild(li)
    }
}

// ------------------------------------------------------------------------------------------------------------------------
// HANDLE INPUT / CONVERSATION SELECTION

input.addEventListener('change', function () {
    const fileReader = new FileReader();

    fileReader.onload = () => {
        offset = 0;
        messages = [];
        users = [];
        selectedUser = null;

        if (extractMessages(fileReader.result)) {
            populateSavedLists();
            showMessages(users, messages, offset);
            closeNav();
        }
    }

    fileReader.readAsText(this.files[0]);
})

savedList.addEventListener("click", async e => {
    // Get conversation
    const id = e.target.id
    const conversation = await read(+id);

    console.log(conversation)

    // Reset variables
    offset = 0;
    messages = conversation.messages;
    users = conversation.users;
    selectedUser = null;

    showMessages(conversation.users, conversation.messages, offset);
    closeNav();
})

// ------------------------------------------------------------------------------------------------------------------------
// ADD MESSAGES TO THE BOTTOM ONCE THE USERS REACHES IT

window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50 && selectedUser) {
        offset += messagesPerPage
        showMessages(users, messages, offset);
    }
};