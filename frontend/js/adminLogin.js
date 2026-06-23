// Using global API_BASE from config.js
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginMessage = document.getElementById('adminLoginMessage');

adminLoginForm.addEventListener('submit', async(e)=>{
    e.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if(response.ok){
            if(data.role !== 'admin'){
                adminLoginMessage.textContent = 'This account is a user. Please login in the user page.';
                adminLoginMessage.style.display = 'block';
                adminLoginMessage.style.color = '#C0392B';
                return;
            }
            localStorage.setItem('adminEmail', data.email || email);
            localStorage.setItem('adminName', data.name || '');
            if(data.sector) localStorage.setItem('adminSector', data.sector);
            window.location.href = 'dashboard.html';
            return;
        }

        adminLoginMessage.textContent = data.message || 'Login failed';
        adminLoginMessage.style.display = 'block';
        adminLoginMessage.style.color = '#C0392B';
    } catch (error) {
        adminLoginMessage.textContent = 'Unable to reach the server. Start the backend and refresh.';
        adminLoginMessage.style.display = 'block';
        adminLoginMessage.style.color = '#C0392B';
    }
});