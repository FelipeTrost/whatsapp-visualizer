const saveMessages = (users, messages) => {
    let saved = JSON.parse(localStorage.getItem(localStorageKey));

    if (!saved || !saved instanceof Array) saved = [];

    const title = `Conversation between ${Object.keys(users).join(" - ")} - ${saved.length}`

    saved.push({
        id: saved.length,
        title,
        messages,
        users
    })

    localStorage.setItem(localStorageKey, JSON.stringify(saved));
}