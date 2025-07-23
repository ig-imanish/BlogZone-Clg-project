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
        
        document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                confirmPasswordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
        
        // Password strength indicator
        document.getElementById('password').addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.getElementById('passwordStrength');
            const strengthText = document.getElementById('passwordStrengthText');
            
            // Calculate password strength
            let strength = 0;
            if (password.length >= 8) strength += 25;
            if (password.match(/[A-Z]/)) strength += 25;
            if (password.match(/[0-9]/)) strength += 25;
            if (password.match(/[^A-Za-z0-9]/)) strength += 25;
            
            // Update strength bar
            strengthBar.style.width = strength + '%';
            
            // Update color and text based on strength
            if (strength <= 25) {
                strengthBar.style.backgroundColor = '#ef4444'; // red
                strengthText.textContent = 'Weak password';
            } else if (strength <= 50) {
                strengthBar.style.backgroundColor = '#f59e0b'; // amber
                strengthText.textContent = 'Moderate password';
            } else if (strength <= 75) {
                strengthBar.style.backgroundColor = '#10b981'; // green
                strengthText.textContent = 'Strong password';
            } else {
                strengthBar.style.backgroundColor = '#3b82f6'; // blue
                strengthText.textContent = 'Very strong password';
            }
        });
        
        // Password match validation
        document.getElementById('confirmPassword').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;
            const matchMessage = document.getElementById('passwordMatch');
            
            if (confirmPassword === '') {
                matchMessage.textContent = '';
            } else if (password === confirmPassword) {
                matchMessage.textContent = 'Passwords match';
                matchMessage.style.color = '#10b981'; // green
            } else {
                matchMessage.textContent = 'Passwords do not match';
                matchMessage.style.color = '#ef4444'; // red
            }
        });
        
        // Form submission with validation only
        function validateForm() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                document.getElementById('passwordMatch').textContent = 'Passwords do not match';
                document.getElementById('passwordMatch').style.color = '#ef4444';
                return false;
            }
            return true;
        }
        
        // Add subtle animation to form inputs on focus
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = 'translateY(0)';
            });
        });

        (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'96216027a7d34734',t:'MTc1MzAwMzE1My4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();




// Main form submission handler with API integration
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Validate form first
    if (!validateForm()) {
        return;
    }

    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = { name, email, password };

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:8080/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        console.log('Response status:', response.status);
        console.log('User data sent:', userData);

        if (response.ok) {
            const data = await response.json();
            
            // Check if Toastify is available, otherwise use fallback
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: 'Signup successful! ' + (data.message || 'Welcome to BlogZone!'),
                    duration: 3000,
                    gravity: 'top',
                    position: 'right',
                    backgroundColor: '#4CAF50',
                    className: 'toast-success'
                }).showToast();
            } else {
                // Fallback notification
                showFallbackNotification('Signup successful! Welcome to BlogZone!', 'success');
            }

            // Reset form after successful signup
            this.reset();
            document.getElementById('passwordStrength').style.width = '0%';
            document.getElementById('passwordStrengthText').textContent = 'Password strength';
            document.getElementById('passwordMatch').textContent = '';

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } else {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Signup failed. Please try again.';
            
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: 'Signup failed: ' + errorMessage,
                    duration: 4000,
                    gravity: 'top',
                    position: 'right',
                    backgroundColor: '#f44336',
                    className: 'toast-error'
                }).showToast();
            } else {
                showFallbackNotification('Signup failed: ' + errorMessage, 'error');
            }
        }
    } catch (error) {
        console.error('Network Error:', error);
        
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
                className: 'toast-error'
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
}