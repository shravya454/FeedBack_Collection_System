// Using global API_BASE from config.js

async function getFeedbacks(){

    const adminEmail = localStorage.getItem('adminEmail');

    const response = await fetch(
        `${API_BASE}/feedback/admin/${encodeURIComponent(adminEmail)}`
    );

    const data = await response.json();

    const feedbackContainer =
        document.getElementById('feedbackContainer');

    feedbackContainer.innerHTML = '';

    if(data.length === 0){

        feedbackContainer.innerHTML =
            '<h3>No Feedback Available</h3>';

        return;
    }

    data.forEach((item)=>{

        const date = new Date(item.createdAt)
            .toLocaleString();

        feedbackContainer.innerHTML += `

            <div class="feedback-box">

                <h3>${item.userName}</h3>

                <p>${item.feedback}</p>

                <p>Category: ${item.category}</p>

                <p>⭐ ${item.rating}</p>

                <p>
                    Submitted:
                    ${date}
                </p>

                <p>
                    <strong>Admin Reply:</strong>
                    ${item.reply || 'No reply yet'}
                </p>

                <input
                    type="text"
                    id="reply-${item._id}"
                    placeholder="Type reply"
                >

                <button
                    onclick="sendReply('${item._id}')"
                >
                    Send Reply
                </button>

            </div>

        `;
    });

}

async function sendReply(id){

    const reply =
        document.getElementById(
            `reply-${id}`
        ).value;

    const response = await fetch(

        `${API_BASE}/feedback/reply/${id}`,

        {
            method:'PUT',

            headers:{
                'Content-Type':'application/json'
            },

            body:JSON.stringify({ reply })
        }

    );

    const data = await response.json();

    const btn = document.querySelector(`button[onclick="sendReply('${id}')"]`);
    if(btn){
        const originalText = btn.textContent;
        btn.textContent = response.ok ? 'Sent! ✓' : 'Failed';
        btn.style.background = response.ok ? '#1F6F5C' : 'var(--danger)';
        setTimeout(()=>{
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }

    getFeedbacks();

}

const logoutBtn = document.getElementById('logoutBtn');
const toggleDetails = document.getElementById('toggleDetails');
const accountDetails = document.getElementById('accountDetails');
const sidebarCount = document.getElementById('sidebarCount');
const sidebarReplied = document.getElementById('sidebarReplied');

logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    window.location.href = 'index.html';
});

async function loadAdminSidebar(){
    const name = localStorage.getItem('adminName') || 'N/A';
    const email = localStorage.getItem('adminEmail');
    const sector = localStorage.getItem('adminSector') || '';

    document.getElementById('accName').textContent = `Name: ${name}`;
    document.getElementById('accEmail').textContent = `Email: ${email || 'N/A'}`;
    document.getElementById('accSector').textContent = sector ? `Domain: ${sector}` : '';

    let totalFeedbacks = 0;
    let repliedCount = 0;

    if(email){
        try{
            const res = await fetch(`${API_BASE}/feedback/admin/${encodeURIComponent(email)}`);
            const data = await res.json();
            if(Array.isArray(data)){
                totalFeedbacks = data.length;
                repliedCount = data.filter(i => i.reply && i.reply.trim() !== '').length;
            }
        } catch (err){
            totalFeedbacks = 0;
            repliedCount = 0;
        }
    }

    sidebarCount.textContent = totalFeedbacks;
    sidebarReplied.textContent = repliedCount;
}

getFeedbacks();
loadAdminSidebar();

toggleDetails.addEventListener('click', ()=>{
    const isActive = accountDetails.classList.toggle('active');
    toggleDetails.classList.toggle('expanded', isActive);
});
