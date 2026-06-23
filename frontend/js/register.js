// Using global API_BASE from config.js
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const roleSelect = document.getElementById('role');
const sectorSelect = document.getElementById('sector');

function updateSectorVisibility(){
    if(roleSelect.value === 'admin'){
        sectorSelect.style.display = 'block';
        sectorSelect.required = true;
    }
    else{
        sectorSelect.style.display = 'none';
        sectorSelect.required = false;
        sectorSelect.value = '';
    }
}

roleSelect.addEventListener('change', updateSectorVisibility);
updateSectorVisibility();

registerForm.addEventListener('submit', async(e)=>{

    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const role = roleSelect.value;
    const sector = sectorSelect.value;

    if(role === 'admin' && !sector){
        registerMessage.textContent = 'Please select a sector for admin registration.';
        registerMessage.style.display = 'block';
        registerMessage.style.color = '#C0392B';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                email,
                password,
                role,
                sector
            })
        });

        const data = await response.json();

        if(response.ok){

            localStorage.setItem(
        
                'verifyEmail',
        
                email
        
            );
        
            window.location.href='otp.html';
        
            return;
        
        }

        registerMessage.textContent = data.message || 'Registration failed';
        registerMessage.style.display = 'block';
        registerMessage.style.color = '#C0392B';
    } catch (error) {
        registerMessage.textContent = 'Unable to reach the server. Start the backend and refresh.';
        registerMessage.style.display = 'block';
        registerMessage.style.color = '#C0392B';
    }
});