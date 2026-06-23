const feedbackForm = document.getElementById('feedbackForm');
const userNameInput = document.getElementById('userName');
const messageEl = document.getElementById('successMessage');
const goHomeBtn = document.getElementById('goHomeBtn');

const savedUserName = localStorage.getItem('userName');
if(savedUserName){
    userNameInput.value = savedUserName;
}

feedbackForm.addEventListener('submit', async(e)=>{

    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    if(!userEmail){
        messageEl.textContent = 'Please login first to submit feedback.';
        messageEl.style.display = 'block';
        messageEl.style.color = '#C0392B';
        return;
    }

    const userName = userNameInput.value.trim();
    const feedback = document.getElementById('feedback').value.trim();
    const category = document.getElementById('category').value;
    const adminEmail = document.getElementById('adminEmail').value.trim();
    const rating = document.getElementById('rating').value;

    const response = await fetch(`${API_BASE}/feedback/submit`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            userName,
            userEmail,
            feedback,
            category,
            adminEmail,
            rating
        })
    });

    const data = await response.json();

    if(response.ok && data.message === 'Feedback Submitted Successfully'){
        feedbackForm.reset();
        if(savedUserName){
            userNameInput.value = savedUserName;
        }

        messageEl.textContent = data.message;
        messageEl.style.display = 'block';
        messageEl.style.color = '#1F6F5C';
        goHomeBtn.style.display = 'block';
    } else {
        messageEl.textContent = data.message || 'Unable to submit feedback.';
        messageEl.style.display = 'block';
        messageEl.style.color = '#C0392B';
        goHomeBtn.style.display = 'none';
    }
});

goHomeBtn.addEventListener('click', () => {
    window.location.href = 'home.html';
});