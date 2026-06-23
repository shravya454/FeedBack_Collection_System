// Using global API_BASE from config.js
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async(e)=>{
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
            if(data.role !== 'user'){
                loginMessage.textContent = 'This account is an admin. Please login in the admin page.';
                loginMessage.style.display = 'block';
                loginMessage.style.color = '#C0392B';
                return;
            }

            localStorage.setItem('userEmail', data.email || email);
            localStorage.setItem('userName', data.name || '');
            window.location.href = 'home.html';
            return;
        }

        loginMessage.style.display = 'block';

        if(data.message === 'Please verify your email first'){
            loginMessage.style.color = '#E67E22';
            loginMessage.innerHTML = 'Please verify your email first. <a href="otp.html" style="color: var(--primary); text-decoration: underline; font-weight: bold;">Click here to enter OTP</a>';
            localStorage.setItem('verifyEmail', email);
        } else {
            loginMessage.textContent = data.message || 'Login failed';
            loginMessage.style.color = '#C0392B';
        }
    } catch (error) {
        loginMessage.textContent = 'Unable to reach the server. Start the backend and refresh.';
        loginMessage.style.display = 'block';
        loginMessage.style.color = '#C0392B';
    }
});