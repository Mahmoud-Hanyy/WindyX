//static JSON array for users
const users = [
    { username: "Abd-ElSalam", password: "Abd-ElSalam" },
    { username: "Emara", password: "Emara" },
    { username: "Ramadan", password: "Ramadan" },
    { username: "Hany", password: "Hany" },
    { username: "Kiro", password: "Kiro" },
    { username: "Hussein", password: "Hussein" }
];

//add event listner when page is loaded
document.addEventListener("DOMContentLoaded", () => {
    
    //get HTML elements
    const loginBtn = document.getElementById("loginBtn");
    const errorText = document.getElementById("WrongPass");

    //initially hide WrongPass element
    errorText.style.display = "none";

    //add event listner for button click
    loginBtn.addEventListener("click", () => {
        //get HTML elements
        const username = document.getElementById("name").value.trim();
        const password = document.getElementById("password").value.trim();
        //search for user
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            alert("Login successful!");
            //store username to display greeting
            localStorage.setItem("loggedInUser", username);
            //redirect on success to index.html
            window.location.href = "index.html"; 
        } else {
            //show error message only on failure
            errorText.style.display = "block"; 
        }
    });

    // Hide the error message when the user starts typing again
    document.getElementById("password").addEventListener("input", () => {
        errorText.style.display = "none";
    });
});