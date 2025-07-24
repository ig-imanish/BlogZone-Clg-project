// Add subtle animation to form inputs on focus
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("focus", () => {
    input.style.transform = "translateY(-2px)";
  });

  input.addEventListener("blur", () => {
    input.style.transform = "translateY(0)";
  });
});

// Password toggle functionality
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Enhanced login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status);
        

        if (response.ok) {
            const data = await response.json();
            // console.log('Login successful:', data);
            // console.log('User data:', data.user);

            // Store user data using AuthManager if available, otherwise use localStorage
            if (typeof authManager !== 'undefined') {
                authManager.saveUserData({
                    id: data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    token: data.token
                });
            } else {
                // Fallback to direct localStorage
                localStorage.setItem('userData', JSON.stringify({
                    id: data.user._id || data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    token: data.token,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                }));
            }

            // Show success notification
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: `Welcome back, ${data.user.name}! Redirecting to home page...`,
                    duration: 2500,
                    gravity: 'top',
                    position: 'right',
                    backgroundColor: '#4CAF50',
                    className: 'toast-success',
                    style: {
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }
                }).showToast();
            } else {
                // Fallback notification
                showFallbackNotification(`Welcome back, ${data.user.name}! Redirecting to home page...`, 'success');
            }

            // Reset form
            this.reset();

            // Redirect to home page after 2.5 seconds
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2500);

        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Login failed. Please check your credentials.';

            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: errorMessage,
                    duration: 4000,
                    gravity: 'top',
                    position: 'right',
                    backgroundColor: '#f44336',
                    className: 'toast-error',
                    style: {
                        background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                    }
                }).showToast();
            } else {
                showFallbackNotification(errorMessage, 'error');
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        
        let errorMessage = 'Network error. Please check your connection and try again.';
        
        // Check if it's a connection refused error
        if (error.message.includes('fetch') || error.name === 'TypeError') {
            errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:8080';
        }

        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: errorMessage,
                duration: 5000,
                gravity: 'top',
                position: 'right',
                backgroundColor: '#f44336',
                className: 'toast-error',
                style: {
                    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                }
            }).showToast();
        } else {
            showFallbackNotification(errorMessage, 'error');
        }
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Fallback notification function when Toastify is not available
function showFallbackNotification(message, type) {
    // Try to use the existing toast element first
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        const toastMessage = existingToast.querySelector('.toast-message') || existingToast;
        toastMessage.textContent = message;
        existingToast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        
        existingToast.classList.remove('translate-y-20', 'opacity-0');
        existingToast.classList.add('translate-y-0', 'opacity-100');
        
        setTimeout(() => {
            existingToast.classList.remove('translate-y-0', 'opacity-100');
            existingToast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    } else {
        // Fallback to alert if no toast element exists
        alert(message);
    }

    localStorage.setItem("token", data.token);
  });
