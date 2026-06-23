const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const emailInput = document.getElementById('emailInput');
const displayEmail = document.getElementById('displayEmail');
const otpInput = document.getElementById('otpInput');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const messageText = document.getElementById('messageText');

function showMessage(text, color) {
    messageText.textContent = text;
    messageText.style.display = 'block';
    messageText.style.color = color;
}

async function requestResetOTP() {
    const email = emailInput.value.trim().toLowerCase();
    if (!email) {
        showMessage('Please enter a valid email address.', 'var(--danger)');
        return;
    }

    try {
        messageText.style.display = 'none';
        const response = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            displayEmail.value = email;
            step1.style.display = 'none';
            step2.style.display = 'block';
            showMessage(data.message || 'OTP sent to your email. Please check your inbox.', '#1F6F5C');
        } else {
            showMessage(data.message || 'Failed to request reset OTP.', 'var(--danger)');
        }
    } catch (error) {
        showMessage('Unable to reach server. Please start backend and try again.', 'var(--danger)');
    }
}

async function verifyAndResetPassword() {
    const email = displayEmail.value.trim().toLowerCase();
    const otp = otpInput.value.trim();
    const passwordVal = newPassword.value;
    const confirmPasswordVal = confirmPassword.value;

    if (!otp || otp.length !== 6) {
        showMessage('Please enter a valid 6-digit OTP.', 'var(--danger)');
        return;
    }

    if (passwordVal !== confirmPasswordVal) {
        showMessage('New password and confirmation password do not match.', 'var(--danger)');
        return;
    }

    if (passwordVal.length < 6) {
        showMessage('Password must be at least 6 characters long.', 'var(--danger)');
        return;
    }

    try {
        messageText.style.display = 'none';
        const response = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                otp,
                newPassword: passwordVal
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Password reset successfully! Redirecting to login...', '#1F6F5C');
            setTimeout(() => {
                window.location.href = 'loginChoice.html';
            }, 2000);
        } else {
            showMessage(data.message || 'Failed to reset password.', 'var(--danger)');
        }
    } catch (error) {
        showMessage('Unable to reach server. Please check connection and try again.', 'var(--danger)');
    }
}
