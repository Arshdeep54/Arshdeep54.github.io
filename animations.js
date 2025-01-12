// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

// Add reveal class to sections and observe them
document.querySelectorAll('.section_s_p').forEach((section) => {
    section.classList.add('reveal');
    observer.observe(section);
});

// Add smooth hover effect to skill items
document.querySelectorAll('.skillsCol ul li').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateX(5px)';
    });
    
    item.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateX(0)';
    });
});
