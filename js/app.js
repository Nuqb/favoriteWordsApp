console.log("gavin williams");

let inputFavColor = document.getElementById("color-picker");
let saveColorButton = document.getElementById("save-color-button");

saveColorButton.onclick = function() {
    console.log("favColor: ", inputFavColor.value);
    let data = "color=" + encodeURIComponent(inputFavColor.value);

    fetch("http://localhost:8080/sessions/settings", {
        headers: {
            "Authorization": authorizationHeader(),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        body: data, 
    })
    .then(function(response) {
        console.log(response.text);
        document.body.style.backgroundColor = inputFavColor.value;
    })
}

let inputWord = document.getElementById("input-word");
let inputLanguageOrigin = document.getElementById("input-language-origin");
let inputWordDefinition = document.getElementById("input-word-definition");
let wordWrapper = document.querySelector("section");
let addWordButton = document.getElementById("add-word-button");
let saveWordButton = document.getElementById("save-word-button");
let editId = null;

let createAccountButton = document.getElementById("create-account-button");
createAccountButton.onclick = function() {
    console.log("create account button clicked")
    let inputFirstName = document.getElementById("input-first-name");
    let inputLastName = document.getElementById("input-last-name");
    let inputEmail = document.getElementById("input-email");
    let inputPassword = document.getElementById("input-password");
    let data = "first_name=" + encodeURIComponent(inputFirstName.value);
    data += "&last_name=" + encodeURIComponent(inputLastName.value);
    data += "&email=" + encodeURIComponent(inputEmail.value);
    data += "&password=" + encodeURIComponent(inputPassword.value);
    console.log(data);
    fetch("http://localhost:8080/users", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authorizationHeader()
        }
    }).then(function(response) {
        response.text().then(function(text){
            if (response.status == 201){
                console.log(response.text)
                inputFirstName.value = "";
                inputLastName.value = "";
                inputEmail.value = "";
                inputPassword.value = "";
            } else {
                console.log(response.text)
            }
        })
    })
}

let loginButton = document.getElementById("login-button");
loginButton.onclick = function authenticateUserOnServer() {

    let inputEmail = document.getElementById("log-in-input-email");
    let inputPassword = document.getElementById("log-in-input-password");
    if (inputEmail.value == "" || inputPassword.value == ""){return}
    let data = "email=" + encodeURIComponent(inputEmail.value);
    data += "&password=" + encodeURIComponent(inputPassword.value);
    console.log(data);

    fetch("http://localhost:8080/sessions/auth", {
        method: "POST",
        body: data,
        headers: {
            "Authorization": authorizationHeader(),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function(response) {
        response.text().then(function(text){

            console.log("response: ", text)
            if (response.status == 201) {
            console.log("signed in")

            inputEmail.value = "";
            inputPassword.value = "";
            clearLoadedWords();
            loadWordsFromServer();
            } else {
                console.log("something went wrong", text)
            }
        })
    })
}

let signOutButton = document.getElementById("sign-out-button");
signOutButton.onclick = signOut;
function signOut(){
    fetch(`http://localhost:8080/sessions`, {
        method: "DELETE",
        headers: {
            "Authorization": authorizationHeader(),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function(response){
        console.log("response: ", response)
        clearLoadedWords();
        loadWordsFromServer();
    })
}

function addTheWord(data) {
    let theWord = document.createElement("h3");
    let wordOrigin = document.createElement("p");
    let wordDefinition = document.createElement("p");

    theWord.textContent = "word: " + data["word"]
    wordOrigin.textContent = "language: " + data["origin"]
    wordDefinition.textContent = "definition: " + data["definition"]

    wordWrapper.appendChild(theWord);
    wordWrapper.appendChild(wordOrigin);
    wordWrapper.appendChild(wordDefinition);

    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    editButton.textContent = "Edit word";
    deleteButton.textContent = "Delete word";

    editButton.onclick = function(){
        console.log("edit button clicked on: ", data["id"])
        inputWord.value = data["word"];
        inputLanguageOrigin.value = data["origin"];
        inputWordDefinition.value = data["definition"];
        editId = data["id"];
    }

    saveWordButton.onclick = function() {
        let editData = "word="+encodeURIComponent(inputWord.value) + "&origin="+encodeURIComponent(inputLanguageOrigin.value) +"&definition="+encodeURIComponent(inputWordDefinition.value)

        fetch(`http://localhost:8080/words/${editId}`, {
            method: "PUT",
            body: editData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": authorizationHeader()
            }
        }).then(function(response) {
            console.log("response: ", response)
            clearLoadedWords()
            loadWordsFromServer()
            inputWord.value = ""
            inputLanguageOrigin.value = ""
            inputWordDefinition.value = ""
        })
    }
    deleteButton.onclick = function(){
        if(confirm("Are you sure you want to delete the word?")){

            let deleteId = data["id"]
            fetch(`http://localhost:8080/words/${deleteId}`, {
            method: "DELETE",
            body: "",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": authorizationHeader()
            }
        }).then(function(response){
            console.log("response: ", response)
            clearLoadedWords()
            loadWordsFromServer()
        })
    }
    }

    wordWrapper.appendChild(editButton);
    wordWrapper.appendChild(deleteButton);
}

function addNewWord() {

    let data = "word="+encodeURIComponent(inputWord.value) + "&origin="+encodeURIComponent(inputLanguageOrigin.value) +"&definition="+encodeURIComponent(inputWordDefinition.value);

    console.log(data)
    fetch("http://localhost:8080/words", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authorizationHeader()
        },
        
    }).then(function(response) {
        console.log("response", response);
        clearLoadedWords();
        loadWordsFromServer();
        inputWord.value = "";
        inputLanguageOrigin.value = "";
        inputWordDefinition.value = "";
    })
}

function loadWordsFromServer() {
    fetch("http://localhost:8080/words" , {
        method: "GET",
        headers: {
            "Authorization": authorizationHeader()
        },
    }).then(function(response){
        if(response.status == 401) {
            return;
        }
        response.json()
        .then(function(data){
            console.log(data)
            let words = data
            words.forEach(addTheWord)
            })
        })
}

function clearLoadedWords(){
    wordWrapper.textContent = ""
}

addWordButton.onclick = addNewWord;

function authorizationHeader() {
 
    let sessionID = localStorage.getItem("sessionID");
 
    if (sessionID) {
 
       return `Bearer ${sessionID}`;
 
     } else {
 
       return null;
 
    }
 
 }

function createSessionId() {
    fetch("http://localhost:8080/sessions", {
        headers: {
            "Authorization": authorizationHeader()
        }
    }).then(function(response) {
        if (response.status == 200) {
            response.json().then(function (session){
                localStorage.setItem("sessionID", session.id);
                console.log("session id from server: ", session.id);
                console.log("session data from server: ", session.data);

                if(session.data.fav_color) {
                    inputFavColor.value = session.data.fav_color;
                    document.body.style.backgroundColor = session.data.fav_color
                }

                loadWordsFromServer()
            })
        }
    })
}

document.addEventListener("DOMContentLoaded", function () {
    const signUpToggleButton = document.getElementById("sign-up-toggle-button");
    const logInToggleButton = document.getElementById("log-in-toggle-button");
    const signUpForm = document.querySelector(".sign-up-form");
    const logInForm = document.querySelector(".log-in-form");

    // Toggle sign-up form visibility
    signUpToggleButton.addEventListener("click", function () {
        signUpForm.style.display =
            signUpForm.style.display === "none" || signUpForm.style.display === "" ? "block" : "none";
    });

    // Toggle log-in form visibility
    logInToggleButton.addEventListener("click", function () {
        logInForm.style.display =
            logInForm.style.display === "none" || logInForm.style.display === "" ? "block" : "none";
    });

    // Show the "Sign Out" button after login
    const loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", function () {
        // Simulate a successful login
        logInForm.style.display = "none";
        signOutButton.style.display = "block";
    });
});


createSessionId()
