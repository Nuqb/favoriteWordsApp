console.log("modalLogic")

const signUpButton = document.getElementById("sign-up-button");
let open = false

signUpButton.addEventListener("click", () => {
    console.log("sign up button clicked")
    createModal()
})


function createModal() {

    if (open) {
        const overlay = document.getElementById("overlay");
        const modal = document.getElementById("modal");
        modal.remove();
        overlay.remove();
        open = false;
    }
    else { 
        open = true

        const overlay = document.createElement("div");
        overlay.setAttribute("id", "overlay")
        document.body.appendChild(overlay);

        const modal = document.createElement("div");
        modal.setAttribute("id", "modal")
        modal.innerHTML = `        

        <div class="sign-up-form">

            <div class="input-box">
                <i class="fa-solid fa-user"></i>
                <input id="input-first-name" type="text" placeholder="First name">
            </div>

            <div class="input-box">
                <i class="fa-solid fa-user"></i>
                <input id="input-last-name" type="text" placeholder="Last name">
            </div>

            <div class="input-box">
                <i class="fa-solid fa-envelope"></i>
                <input id="input-email" type="email" placeholder="Email">
            </div>

            <div class="input-box">
                <i class="fa-solid fa-lock"></i>
                <input id="input-password" type="password" placeholder="Password">
            </div>

            <button id="create-account-button">Create Account</button>

        </div>`

        document.body.appendChild(modal);
    }
}

