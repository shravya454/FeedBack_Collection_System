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
            feedbackContainer.innerHTML += `
                <div class="feedback-box">
                    <h3>${item.userName || 'You'}</h3>
                    <p>${item.feedback}</p>
                    <p>Category: ${item.category || 'N/A'}</p>
                    <p>For Admin: ${item.adminName || item.adminEmail || 'N/A'}</p>
                    <p>⭐ ${item.rating || 'N/A'}</p>
                    <p>Submitted: ${date}</p>
                    <p><strong>Admin Reply:</strong> ${item.reply || 'No reply yet'}</p>
                </div>
            `;
        });
    } catch (error) {
        feedbackContainer.innerHTML = `<p>Error loading feedback: ${error.message}</p>`;
    }
}
