// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Countdown Timer
function updateCountdown(config) {
    // Set the wedding date (July 13, 2025)
    const weddingDate = new Date(config.weddingDate).getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the countdown display
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');

    // If the countdown is over, display some message
    if (distance < 0) {
        if (daysElement) daysElement.textContent = '00';
        if (hoursElement) hoursElement.textContent = '00';
        if (minutesElement) minutesElement.textContent = '00';
        if (secondsElement) secondsElement.textContent = '00';
    }
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        // Show a temporary notification
        showNotification('Bank number copied to clipboard!');
    }, function (err) {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Bank number copied to clipboard!');
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
        }
        document.body.removeChild(textArea);
    });
}

// Show notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Attendance button functionality
document.addEventListener('DOMContentLoaded', function () {
    const attendanceBtns = document.querySelectorAll('.attendance-btn');

    attendanceBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            attendanceBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Comment form submission
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const message = this.querySelector('textarea').value;
            const attendance = this.querySelector('.attendance-btn.active').textContent;

            if (name && message) {
                addComment(name, message, attendance);
                this.reset();
                // Reset attendance to first option
                attendanceBtns.forEach(b => b.classList.remove('active'));
                attendanceBtns[0].classList.add('active');
                showNotification('Comment added successfully!');
            }
        });
    }

    // Gallery image click functionality
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function () {
            openImageModal(this.src);
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.couple-info > div, .story-item, .gallery-item, .event-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add comment function
function addComment(name, message, attendance) {
    const commentsList = document.querySelector('.comments-list');
    const commentCount = document.querySelector('.comment-count');

    if (commentsList && commentCount) {
        // Create new comment element
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';

        // Determine attendance status class
        let statusClass = 'attend';
        if (attendance.toLowerCase() === 'no') statusClass = 'not-attend';
        else if (attendance.toLowerCase() === 'maybe') statusClass = 'maybe';

        commentItem.innerHTML = `
            <div class="comment-header-info">
                <span class="commenter-name">${name}</span>
                <span class="attendance-status ${statusClass}">${attendance === 'Yes' ? 'Attend' : attendance === 'No' ? 'Not Attend' : 'Maybe'}</span>
            </div>
            <div class="comment-text">${message}</div>
        `;

        // Add to comments list
        commentsList.appendChild(commentItem);

        // Update comment count
        const currentCount = parseInt(commentCount.textContent);
        commentCount.textContent = String(currentCount + 1).padStart(2, '0');

        // Animate new comment
        commentItem.style.opacity = '0';
        commentItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            commentItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            commentItem.style.opacity = '1';
            commentItem.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Image modal functionality
function openImageModal(src) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;

    // Create image element
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;

    modal.appendChild(img);
    document.body.appendChild(modal);

    // Close modal on click
    modal.addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    // Close modal on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Map button functionality
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-map') || e.target.closest('.btn-map')) {
        e.preventDefault();
        // You can replace these coordinates with actual venue coordinates
        const defaultLocation = "https://www.google.com/maps/search/Jl.+Terusan+Jakarta+No.53,+Cicaheum,+Kec.+Kiaracondong,+Kota+Bandung,+Jawa+Barat+40291";
        window.open(defaultLocation, '_blank');
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg');

    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Navbar scroll effect (if you add a navbar later)
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Loading animation
window.addEventListener('load', function () {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';

        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Apply lazy loading to images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Audio control (if you want to add background music)
let audioPlayer = null;

function initAudio() {
    // You can add a wedding song here
    // audioPlayer = new Audio('path/to/wedding-song.mp3');
    // audioPlayer.loop = true;
    // audioPlayer.volume = 0.3;
}

function toggleAudio() {
    if (audioPlayer) {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }
}

// Initialize audio on first user interaction
document.addEventListener('click', function () {
    if (!audioPlayer) {
        initAudio();
    }
}, { once: true });

// Print functionality for invitation
function printInvitation() {
    window.print();
}

// Share functionality
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: 'The Wedding of Tâm & Giao',
            text: 'You are invited to our wedding celebration!',
            url: window.location.href
        });
    } else {
        // Fallback - copy URL to clipboard
        copyToClipboard(window.location.href);
        showNotification('Wedding invitation link copied to clipboard!');
    }
}

function updateWeddingDate(config) {
    const sortDayString = `${config.weddingDay}.${config.weddingMonth}.${config.weddingYear}`;
    const longDateString = `Ngày ${config.weddingDay} tháng ${config.weddingMonth} năm ${config.weddingYear}`;
    const moonDayString = `${config.weddingMoonDay}/${config.weddingMoonMonth} ${config.weddingMoonYear}`;

    const longDateStringElements = document.getElementsByClassName('wedding-date-long-day');
    const shortDateStringElements = document.getElementsByClassName('wedding-date-short-day');
    const moonDateElements = document.getElementsByClassName('moon-date');

    const traditionalTimeElement = document.querySelector('.traditional-time');
    if (traditionalTimeElement) {
        traditionalTimeElement.textContent = config.traditionalTime;
    }
    const customerTimeElement = document.querySelector('.customer-time');
    if (customerTimeElement) {
        customerTimeElement.textContent = config.customerTime;
    }
    const partyTimeElement = document.querySelector('.party-time');
    if (partyTimeElement) {
        partyTimeElement.textContent = config.partyTime;
    }

    const weddingWeekDayElement = document.querySelector('.wedding-week-day');
    if (weddingWeekDayElement) {
        weddingWeekDayElement.textContent = config.weddingWeekDay;
    }
    for (const element of longDateStringElements) {
        element.textContent = longDateString;
    }
    for (const element of moonDateElements) {
        element.textContent = moonDayString;
    }
    for (const element of shortDateStringElements) {
        element.textContent = sortDayString;
    }
}

async function run() {
    const response = await fetch('config.json');
    const config = await response.json();

    // Update countdown every second
    setInterval(() => updateCountdown(config), 1000);

    updateWeddingDate(config);
    // Initial call to display countdown immediately
    updateCountdown(config);
}

run();
