document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.querySelector('.btn-edit');
    const form = document.querySelector('.profile-form');
    const inputs = form.querySelectorAll('input');
    const logoutBtn = document.getElementById('logoutBtn');
    const infoText = document.querySelector('.info-text');

   
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    
    infoText.innerHTML = `<p><strong>Name:</strong> ${currentUser.fullName}</p>
                          <p><strong>Email:</strong> ${currentUser.email}</p>`;

   
    inputs[0].value = currentUser.fullName;
    inputs[1].value = currentUser.email;
    inputs[2].value = currentUser.password;
    inputs[3].value = currentUser.password;

    
    form.classList.remove('show');
    inputs.forEach(i => i.disabled = true);

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = !form.classList.contains('show');

        if (isHidden) {
           
            form.classList.add('show');
            inputs.forEach(i => i.disabled = false);
            editBtn.textContent = 'Cancel';
        } else {
            
            form.classList.remove('show');
            inputs.forEach(i => i.disabled = true);
            editBtn.textContent = 'Edit';
        }
    });

  
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const password = inputs[2].value.trim();
        const confirmPassword = inputs[3].value.trim();

        if (!fullName || !email || !password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(u => {
            if (u.email === currentUser.email) {
                return { fullName, email, password, userName: u.userName };
            }
            return u;
        });
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = { fullName, email, password, userName: currentUser.userName };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        
        infoText.innerHTML = `<p><strong>Name:</strong> ${currentUser.fullName}</p>
                              <p><strong>Email:</strong> ${currentUser.email}</p>`;

        alert("Profile updated successfully!");
        form.classList.remove('show');
        inputs.forEach(i => i.disabled = true);
        editBtn.textContent = 'Edit';
    });

    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = "index.html";
    });
});
