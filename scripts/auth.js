//static JSON array for users
const users = [
    { username: "Abd-ElSalam", password: "Abd-ElSalam" },
    { username: "Emara", password: "Emara" },
    { username: "Ramadan", password: "Ramadan" },
    { username: "Hany", password: "Hany" },
    { username: "Kiro", password: "Kiro" },
    { username: "Hussein", password: "Hussein" }
];

//add event listener when page is loaded
document.addEventListener("DOMContentLoaded", () => {

    //get HTML elements
    const loginBtn = document.getElementById("loginBtn");
    const errorText = document.getElementById("wrongPass");

    //initially hide wrongPass element
    errorText.style.display = "none";

    //add event listener for button click
    loginBtn.addEventListener("click", () => {
        //get HTML elements
        const username = document.getElementById("name").value.trim();
        const password = document.getElementById("password").value.trim();
        //search for user
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            alert("Login successful!");
            //store username to display greeting

            //call succefullogin function
            handleSuccessfulLogin(username);

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

function handleSuccessfulLogin(username) {
    const userData = {
        username: username,
        searchHistory: JSON.parse(localStorage.getItem(`userData_${username}`))?.searchHistory || [],
        lastCity: JSON.parse(localStorage.getItem(`userData_${username}`))?.lastCity || "",
    };
    localStorage.setItem("loggedInUser", username);

    localStorage.setItem(`userData_${username}`, JSON.stringify(userData));
    //redirect on success to index.html
    window.location.href = "index.html";

}
function logOut() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "log_in.html";
}