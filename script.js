// Hidden console message for the console challenge
console.log(" Can you find the hidden flags? Here's one: flag{console_master}");

// Initialize score
let score = 0;
const scoreElement = document.getElementById('nav-score-value');
const solvedChallenges = new Set();

function createConfetti(element) {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        element.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Flag data stored in JavaScript
const flagData = {
    'base64': 'FLAG{69}',
    'caesar': 'FLAG{CIPHER}',
    'hex': 'flag{hex_fun}',
    'binary': 'flag',
    'morse': 'FLAGMDIT',
    'hidden-image-1': 'FLAG{DUMP}',
    'image-flag-decoder': 'FLAG{hidden_image}',
    'file-author': 'FLAG{Mask}',
    'file-keywords': 'FLAG{OCTAL}',
    'dashboard-hunt': 'FLAG{Cracked202536}',
    'getting-started': 'FLAG{Your_Secret_Flag_Here}',
    'logo-mystery': 'FLAG{Logo-202589}',
    'social-decode': 'FLAG{Twitter202567}',
    'about-section-secret': 'FLAG{SquidGame_Win2025}',
    'mathematical-mystery': 'CTF{FLAG_AT_FILE}',
    'time-riddle': 'CTF{FLAG_FINDER}',
    'word-play': 'CTF{MOUSE_FOUND}',
    'color-riddle': 'CTF{FLAG_CRACKED}'
};

// Function to check flag
function checkFlag(button) {
    const card = button.closest('.challenge-card');
    const input = card.querySelector('input');
    const status = card.querySelector('.status');
    const challengeId = card.getAttribute('data-id');
    
    if (!input.value) {
        status.textContent = 'Please enter a flag';
        status.className = 'status incorrect';
        return;
    }

    const userFlag = input.value.trim();
    const correctFlag = flagData[challengeId];

    if (userFlag === correctFlag) {
        // Correct answer
        const oldScore = score;
        score += 10;
        
        // Animate score counting up
        const navScore = document.querySelector('.nav-score');
        const duration = 500; // Duration in milliseconds
        const start = Date.now();
        
        const animateScore = () => {
            const now = Date.now();
            const progress = Math.min(1, (now - start) / duration);
            const currentScore = Math.floor(oldScore + (score - oldScore) * progress);
            scoreElement.textContent = currentScore;
            
            if (progress < 1) {
                requestAnimationFrame(animateScore);
            } else {
                scoreElement.textContent = score;
            }
        };
        
        requestAnimationFrame(animateScore);
        
        // Add score update animation
        navScore.classList.add('score-update');
        setTimeout(() => {
            navScore.classList.remove('score-update');
        }, 500);
        
        status.textContent = 'Correct! +10 points';
        status.className = 'status correct';
        
        // Create confetti
        createConfetti(status);
        
        // Disable input and button
        input.disabled = true;
        button.disabled = true;
        
        // Save progress
        const progress = JSON.parse(localStorage.getItem('ctfProgress') || '{}');
        progress[card.querySelector('h3').textContent] = true;
        localStorage.setItem('ctfProgress', JSON.stringify(progress));
        
        // Add solved class
        card.classList.add('solved');
    } else {
        // Incorrect answer
        status.textContent = 'Incorrect flag, try again!';
        status.className = 'status incorrect';
        
        // Shake animation
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
    }
}

function resetGame() {
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.classList.add('refreshing');
    
    // Reset score
    score = 0;
    scoreElement.textContent = '0';
    
    // Clear local storage
    localStorage.removeItem('ctfProgress');
    
    // Reset all challenge cards
    document.querySelectorAll('.challenge-card').forEach(card => {
        // Reset input
        const input = card.querySelector('input');
        if (input) {
            input.value = '';
            input.disabled = false;
        }
        
        // Reset button
        const button = card.querySelector('button');
        if (button) {
            button.disabled = false;
        }
        
        // Reset status
        const status = card.querySelector('.status');
        if (status) {
            status.textContent = '';
            status.className = 'status';
        }
        
        // Remove solved class
        card.classList.remove('solved');
    });
    
    // Add a small delay for visual feedback
    setTimeout(() => {
        refreshBtn.classList.remove('refreshing');
        
        // Show reset confirmation with animation
        const navScore = document.querySelector('.nav-score');
        navScore.classList.add('score-update');
        setTimeout(() => navScore.classList.remove('score-update'), 500);
    }, 1000);
}

// Load saved progress
window.addEventListener('load', () => {
    const progress = JSON.parse(localStorage.getItem('ctfProgress') || '{}');
    
    Object.entries(progress).forEach(([challengeName, solved]) => {
        if (solved) {
            const card = Array.from(document.querySelectorAll('.challenge-card'))
                .find(card => card.querySelector('h3').textContent === challengeName);
            
            if (card) {
                const input = card.querySelector('input');
                const button = card.querySelector('button');
                const status = card.querySelector('.status');
                
                input.disabled = true;
                button.disabled = true;
                status.textContent = 'Solved! +10 points';
                status.className = 'status correct';
                card.classList.add('solved');
                
                score += 10;
            }
        }
    });
    
    scoreElement.textContent = score;
});

// Add hover effect to challenge cards
document.querySelectorAll('.challenge-card:not(.coming-soon)').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 5px 15px rgba(0, 255, 0, 0.2)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});
