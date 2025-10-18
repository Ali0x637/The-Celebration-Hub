document.getElementById('NewAccForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const userName = document.getElementById('userName').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const alertBox = document.getElementById('alertBox');

    if (!fullName || !userName || !email || !password || !confirmPassword) {
        alertBox.textContent = "Please fill all fields.";
        alertBox.className = "alert alert-danger text-center";
        alertBox.classList.remove("d-none");
        return;
    }

    if (password !== confirmPassword) {
        alertBox.textContent = "Passwords do not match.";
        alertBox.className = "alert alert-danger text-center";
        alertBox.classList.remove("d-none");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(u => u.email === email)) {
        alertBox.textContent = "Email already registered.";
        alertBox.className = "alert alert-danger text-center";
        alertBox.classList.remove("d-none");
        return;
    }

    const newUser = { fullName, userName, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alertBox.textContent = "Account created successfully!";
    alertBox.className = "alert alert-success text-center";
    alertBox.classList.remove("d-none");

    setTimeout(() => {
        window.location.href = "home.html";
    }, 1000);
});
