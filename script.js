// Highlight active nav link on scroll
const sections = document.querySelectorAll('section, [id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('[id]').forEach(el => observer.observe(el));
