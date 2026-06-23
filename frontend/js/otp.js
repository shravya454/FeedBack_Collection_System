// Retrieve email to verify from local storage
const verifyEmail = localStorage.getItem('verifyEmail');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const messageEl = document.getElementById('message');
const resendLink = document.getElementById('resendLink');

if (verifyEmail) {
    emailInput.value = verifyEmail;
} else {
    // If no email found in local storage, prompt user or send back
    messageEl.textContent = 'No verification email found. Please register first.';
    messageEl.style.display = 'block';
    messageEl.style.color = 'var(--danger)';
}

async function verifyOTP() {
    const email = emailInput.value.trim();
    const otp = otpInput.value.trim();

    if (!email) {
        showMessage('Email is required. Please register again.', 'var(--danger)');
        return;
    }
    if (!otp || otp.length !== 6) {
        showMessage('Please enter a valid 6-digit OTP code.', 'var(--danger)');
        return;
    }

    try {
        messageEl.style.display = 'none';
        const response = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Email verified successfully! Redirecting...', '#1F6F5C');
            // Remove temp email from storage
            localStorage.removeItem('verifyEmail');
            setTimeout(() => {
                window.location.href = 'loginChoice.html';
            }, 1800);
        } else {
            showMessage(data.message || 'OTP verification failed.', 'var(--danger)');
        }
    } catch (error) {
        showMessage('Unable to reach server. Please try again later.', 'var(--danger)');
    }
}

async function resendOTP() {
    const email = emailInput.value.trim();
    if (!email) {
        showMessage('No email address found to resend OTP.', 'var(--danger)');
        return;
    }

    // Disable the link during resending
    resendLink.style.pointerEvents = 'none';
    resendLink.style.opacity = '0.5';
    resendLink.textContent = 'Sending...';

    try {
        const response = await fetch(`${API_BASE}/auth/resend-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'A new OTP has been sent to your email.', '#1F6F5C');
        } else {
            showMessage(data.message || 'Failed to resend OTP.', 'var(--danger)');
        }
    } catch (error) {
        showMessage('Unable to reach server. Please check connection.', 'var(--danger)');
    } finally {
        // Re-enable resend link after 5 seconds to prevent spamming
        setTimeout(() => {
            resendLink.style.pointerEvents = 'auto';
            resendLink.style.opacity = '1';
            resendLink.textContent = 'Resend OTP';
        }, 5000);
    }
}

function showMessage(text, color) {
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    messageEl.style.color = color;
}