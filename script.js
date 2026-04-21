// Collapsible sections
function expandSection(btn, body) {
    btn.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    body.classList.remove('collapsed');
    body.addEventListener('transitionend', () => {
        body.style.overflow = 'visible';
    }, { once: true });
}

function collapseSection(btn, body) {
    btn.setAttribute('aria-expanded', 'false');
    body.style.overflow = 'hidden';
    body.classList.add('collapsed');
}

document.querySelectorAll('.collapsible-toggle').forEach(btn => {
    const body = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
        if (btn.getAttribute('aria-expanded') === 'true') {
            collapseSection(btn, body);
        } else {
            expandSection(btn, body);
        }
    });
});

// Expand projects when nav link is clicked while collapsed
document.querySelector('a[href="#projects"]')?.addEventListener('click', () => {
    const btn = document.querySelector('.collapsible-toggle[aria-controls="projects-list"]');
    if (btn && btn.getAttribute('aria-expanded') === 'false') {
        const body = document.getElementById('projects-list');
        expandSection(btn, body);
    }
});

// Project carousel
const carousel = document.querySelector('.project-carousel');
if (carousel) {
    const slides  = carousel.querySelectorAll('.carousel-slide');
    const drops   = carousel.querySelectorAll('.project-drop');
    const dots    = carousel.querySelectorAll('.dot');
    let current = 0;
    let dropOpen = false;
    let animating = false;

    function goTo(index, dir) {
        if (animating) return;
        const next = (index + slides.length) % slides.length;
        if (next === current) return;
        animating = true;

        dropOpen = false;
        drops.forEach(d => d.classList.remove('open'));

        const outSlide = slides[current];
        const inSlide  = slides[next];

        outSlide.classList.add(dir > 0 ? 'exit-left' : 'exit-right');

        inSlide.style.transition = 'none';
        inSlide.classList.add(dir > 0 ? 'enter-right' : 'enter-left');

        requestAnimationFrame(() => requestAnimationFrame(() => {
            inSlide.style.transition = '';
            inSlide.classList.remove('enter-right', 'enter-left');
            inSlide.classList.add('active');
            outSlide.classList.remove('active');
        }));

        outSlide.addEventListener('transitionend', () => {
            outSlide.classList.remove('exit-left', 'exit-right');
            animating = false;
        }, { once: true });

        current = next;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(current - 1, -1));
    carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1,  1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i, i > current ? 1 : -1)));

    carousel.querySelectorAll('.project-img').forEach((img, i) => {
        img.addEventListener('click', () => {
            if (i !== current) return;
            dropOpen = !dropOpen;
            drops[current].classList.toggle('open', dropOpen);
        });
    });
}

// Slot machine animation for stat cards
document.querySelectorAll('.stat-value').forEach((el, index) => {
    const match = el.textContent.match(/^(\d+)(.*)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];

    const reel = document.createElement('div');
    reel.className = 'slot-reel';
    for (let i = 0; i <= target; i++) {
        const digit = document.createElement('div');
        digit.className = 'slot-digit';
        digit.textContent = i + suffix;
        reel.appendChild(digit);
    }

    el.textContent = '';
    el.appendChild(reel);

    requestAnimationFrame(() => {
        const itemH = reel.firstChild.getBoundingClientRect().height;
        el.style.height = itemH + 'px';
        const duration = 2500;
        setTimeout(() => {
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.85, 0.25, 1)`;
            reel.style.transform = `translateY(-${target * itemH}px)`;
        }, 100 + index * (duration + 100));
    });
});

// Stagger skill tags into view one category at a time
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let delay = 0;
            document.querySelectorAll('.skill-section').forEach(section => {
                const tags = section.querySelectorAll('.skill-tag');
                tags.forEach((tag, i) => {
                    setTimeout(() => tag.classList.add('visible'), delay + i * 250);
                });
                delay += (tags.length - 1) * 150 + 350 + 500;
            });
            skillObserver.disconnect();
        }
    });
}, { threshold: 0.1 });

const skillsCard = document.getElementById('skills');
if (skillsCard) skillObserver.observe(skillsCard);

// Offset anchor scrolling for sticky navbar
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// Highlight active nav link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const navHeight = document.querySelector('.navbar').offsetHeight;

function updateActiveNav() {
    let activeId = null;
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        activeId = 'contact';
    } else {
        const scrollY = window.scrollY + navHeight + 24;
        ['about', 'projects', 'skills', 'contact'].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) activeId = id;
        });
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();
