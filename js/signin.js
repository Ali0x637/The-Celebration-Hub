document.getElementById('loginBtn').addEventListener('click', function () {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const alertBox = document.getElementById('alertBox');

    if (!email || !password) {
        alertBox.textContent = "Please enter email and password.";
        alertBox.className = "alert alert-danger text-center";
        alertBox.classList.remove("d-none");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alertBox.textContent = "Invalid email or password.";
        alertBox.className = "alert alert-danger text-center";
        alertBox.classList.remove("d-none");
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));

    alertBox.textContent = "Login successful!";
    alertBox.className = "alert alert-success text-center";
    alertBox.classList.remove("d-none");

    setTimeout(() => {
        window.location.href = "home.html";
    }, 500);
});
