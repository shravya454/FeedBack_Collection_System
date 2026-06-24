const feedbackContainer = document.getElementById('feedbackContainer');
const userEmail = localStorage.getItem('userEmail');

if (!userEmail) {
    window.location.href = 'login.html';
} else {
    loadUserFeedback();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
});

function buildRepliesHTML(replies) {
    if (!replies || replies.length === 0) {
        return `<p class="no-reply-yet">No reply yet from admin.</p>`;
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

async function loadUserFeedback() {
    try {
        const response = await fetch(
            `${API_BASE}/feedback/user/${encodeURIComponent(userEmail)}`
        );
        const data = await response.json();

        feedbackContainer.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            feedbackContainer.innerHTML = '<h3>No feedback found.</h3>';
            return;
        }

        data.forEach(item => {
            const date = new Date(item.createdAt).toLocaleString();
            const div = document.createElement('div');
            div.className = 'feedback-box';
            div.innerHTML = `
                <h3>${item.userName || 'You'}</h3>
                <p>${item.feedback}</p>
                <p>Category: ${item.category || 'N/A'}</p>
                <p>For Admin: ${item.adminName || item.adminEmail || 'N/A'}</p>
                <p>⭐ ${item.rating || 'N/A'}</p>
                <p>Submitted: ${date}</p>
                <hr>
                <p><strong>Admin Replies</strong></p>
                ${buildRepliesHTML(item.replies)}
            `;
            feedbackContainer.appendChild(div);
        });
    } catch (error) {
        feedbackContainer.innerHTML = `<p>Error loading feedback: ${error.message}</p>`;
    }
}
