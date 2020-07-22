window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

const dbName = "saved-conversations";
const objectStoreName = "conversations"
const localStorageKey = "f"

let db;

// ------------------------------------------------------------------------------------------------------------------------
// OPEN AND SETUP DATABASE
const request = window.indexedDB.open(dbName, 6);

request.onerror = event => {
    alert("Couldn't access locally stored conversations");
    console.error("There was an error opening indexedDB")
};

request.onsuccess = event => {
    db = event.target.result;

    db.onerror = event => console.error("Database error: " + event.target.errorCode);

    populateSavedLists();
};

request.onupgradeneeded = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(objectStoreName)) {
        const objectStore = db.createObjectStore(objectStoreName, {
            autoIncrement: true
        });

        objectStore.createIndex('title', 'title', {
            unique: false
        });
    }
};

// ------------------------------------------------------------------------------------------------------------------------
// INTERACT WITH DATABASE   

const add = object => { // <<--- maybe make this promise based
    const request = db.transaction([objectStoreName], 'readwrite')
        .objectStore(objectStoreName)
        .add(object);

    request.onsuccess = event => console.log('The data has been written successfully');

    request.onerror = function (error) {
        alert("Couldn't store data locally")
        console.log('Failed to write data', error);
    }
}

const read = id => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
        const request = db.transaction([objectStoreName])
            .objectStore(objectStoreName)
            .get(id);

        request.onerror = error => reject(error);

        request.onsuccess = event => resolve(request.result);
    });
}

const readAll = () => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
        const objectStore = db.transaction([objectStoreName]).objectStore(objectStoreName);

        const request = objectStore.getAll();

        request.onerror = error => reject(error);
        request.onsuccess = e => resolve(e.target.result)
    });
}