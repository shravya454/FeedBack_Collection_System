// Using global API_BASE from config.js

function buildRepliesHTML(replies) {
    if (!replies || replies.length === 0) {
        return `<p class="no-reply-yet">No replies yet.</p>`;
    }
    return `
        <div class="reply-thread">
            ${replies.map(r => {
                const t = new Date(r.sentAt).toLocaleString();
                return `<div class="reply-bubble admin-bubble">
                    <span class="reply-text">${r.text}</span>
                    <span class="reply-meta">${t}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

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

        const div = document.createElement('div');
        div.className = 'feedback-box';
        div.id = `fb-${item._id}`;

        div.innerHTML = `
            <h3>${item.userName}</h3>
            <p>${item.feedback}</p>
            <p>Category: ${item.category}</p>
            <p>⭐ ${item.rating}</p>
            <p>Submitted: ${date}</p>
            <hr>
            <p><strong>Admin Replies</strong></p>
            <div class="reply-thread-wrap" id="thread-${item._id}">
                ${buildRepliesHTML(item.replies)}
            </div>
            <textarea
                id="reply-${item._id}"
                placeholder="Type your reply…"
                rows="2"
            ></textarea>
            <button onclick="sendReply('${item._id}')">
                Send Reply
            </button>
        `;

        feedbackContainer.appendChild(div);
    });

}

async function sendReply(id){

    const textarea = document.getElementById(`reply-${id}`);
    const reply = textarea.value.trim();

    if(!reply) return;

    const btn = document.querySelector(`button[onclick="sendReply('${id}')"]`);
    if(btn){
        btn.disabled = true;
        btn.textContent = 'Sending…';
    }

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

    if(btn){
        btn.disabled = false;
        btn.textContent = response.ok ? 'Sent! ✓' : 'Failed';
        btn.style.background = response.ok ? '#1F6F5C' : 'var(--danger)';
        setTimeout(()=>{
            btn.textContent = 'Send Reply';
            btn.style.background = '';
        }, 2000);
    }

    if(response.ok && data.updatedFeedback){
        // Update only the thread area without full reload
        const threadWrap = document.getElementById(`thread-${id}`);
        if(threadWrap){
            threadWrap.innerHTML = buildRepliesHTML(data.updatedFeedback.replies);
        }
        textarea.value = '';
        // Refresh sidebar count
        loadAdminSidebar();
    }

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
                repliedCount = data.filter(i => i.replies && i.replies.length > 0).length;
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
