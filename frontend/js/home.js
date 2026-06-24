const logoutBtn = document.getElementById('logoutBtn');
const toggleDetails = document.getElementById('toggleDetails');
const accountDetails = document.getElementById('accountDetails');
const sidebarCount = document.getElementById('sidebarCount');

// Using global API_BASE from config.js

logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
});

async function loadUserSidebar(){
    const name = localStorage.getItem('userName') || 'N/A';
    const email = localStorage.getItem('userEmail');
    // Admin-only domain should not be shown on user profiles
    document.getElementById('accName').textContent = `Name: ${name}`;
    document.getElementById('accEmail').textContent = `Email: ${email || 'N/A'}`;
    document.getElementById('accSector').textContent = '';

    let totalFeedbacks = 0;
    if(email){
        try{
            const res = await fetch(`${API_BASE}/feedback/user/${encodeURIComponent(email)}`);
            const data = await res.json();
            totalFeedbacks = Array.isArray(data) ? data.length : 0;
        } catch (err){
            totalFeedbacks = 0;
        }
    }
    sidebarCount.textContent = totalFeedbacks;
}

loadUserSidebar();

toggleDetails.addEventListener('click', ()=>{
    const isActive = accountDetails.classList.toggle('active');
    toggleDetails.classList.toggle('expanded', isActive);
});
