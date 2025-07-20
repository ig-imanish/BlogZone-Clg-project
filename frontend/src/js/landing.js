  // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize AOS with enhanced configuration for smoother animations
            AOS.init({
                duration: 1200,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 50,
                mirror: false,
                anchorPlacement: 'top-bottom',
                disable: false,
                startEvent: 'DOMContentLoaded',
                animatedClassName: 'aos-animate',
                initClassName: 'aos-init'
            });
            
            // Refresh AOS on window resize
            window.addEventListener('resize', function() {
                AOS.refresh();
            });
        });
        
        // Typewriter effect
        const typewriterText = "Your Personal Writing Space";
        const typewriterElement = document.getElementById('typewriter');
        let i = 0;
        
        function typeWriter() {
            if (i < typewriterText.length) {
                typewriterElement.textContent += typewriterText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    typewriterElement.textContent = '';
                    i = 0;
                    typeWriter();
                }, 2000);
            }
        }
        
        // Start typewriter effect after page loads
        window.addEventListener('load', function() {
            typeWriter();
        });
        
        // Enhanced counter animation with intersection observer
        const countElements = document.querySelectorAll('.count-animation');
        
        const animateCounters = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target'));
                    const duration = 2000;
                    const step = target / (duration / 30);
                    let current = 0;
                    
                    const counter = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            element.textContent = target;
                            clearInterval(counter);
                        } else {
                            element.textContent = Math.floor(current);
                        }
                    }, 30);
                    
                    observer.unobserve(element);
                }
            });
        };
        
        // Create intersection observer for counter animations
        if (countElements.length > 0) {
            const counterObserver = new IntersectionObserver(animateCounters, {
                threshold: 0.5
            });
            
            countElements.forEach(element => {
                counterObserver.observe(element);
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });