// ===== HF SPACE API =====
const API_BASE = "https://gopallikehack-info-gpsir-era.hf.space";

// ===== THEMES =====
const themes = ['dark','light','sandalwood','greenary','ocean','sunset','midnight','neon','retro','mono'];
let themeIndex = 0;

function toggleTheme() {
    themeIndex = (themeIndex + 1) % themes.length;
    document.documentElement.setAttribute('data-theme', themes[themeIndex]);
    localStorage.setItem('theme', themes[themeIndex]);
}

const saved = localStorage.getItem('theme');
if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    themeIndex = themes.indexOf(saved) || 0;
}

// ===== BOT TOKEN (CHANGE THESE) =====
const BOT_TOKEN = "8743338027:AAHJRm2Q_VKb4HWON90dKzjclaNA5iXpib0" ;  // 👈 Replace with your bot token
const CHAT_ID = "8501984482";      // 👈 Replace with your chat ID

// ===== PAGES =====
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const links = document.querySelectorAll('.nav-links a');
    if (page === 'home') links[0].classList.add('active');
    else if (page === 'library') links[1].classList.add('active');
    else if (page === 'request') links[2].classList.add('active');
}

// ===== PLAYER =====
function playVideo(filename, title) {
    document.getElementById('playerTitle').textContent = title || filename;
    const player = document.getElementById('player');
    player.src = `${API_BASE}/stream/Jujutsu_Kaisen_S3/${encodeURIComponent(filename)}`;
    document.getElementById('playerModal').classList.add('show');
    player.play();
}

function closePlayer() {
    const player = document.getElementById('player');
    player.pause();
    player.src = '';
    document.getElementById('playerModal').classList.remove('show');
}

// ===== LOAD VIDEOS =====
async function loadVideos() {
    const grid = document.getElementById('videoGrid');
    const libGrid = document.getElementById('libraryGrid');
    try {
        const res = await fetch(`${API_BASE}/videos`);
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
            const jjkVideos = data.videos.filter(v => v.includes('Jujutsu_Kaisen_S3'));
            if (jjkVideos.length === 0) {
                grid.innerHTML = '<div class="loading"><i class="fas fa-folder-open"></i> No JJK episodes found.</div>';
                libGrid.innerHTML = '<div class="loading"><i class="fas fa-folder-open"></i> No episodes in library.</div>';
                return;
            }
            const cards = jjkVideos.map((v, i) => {
                const filename = v.split('/').pop();
                const name = filename.replace(/\.(mp4|mkv|avi|mov)$/, '').replace(/_/g, ' ');
                return `
                    <div class="video-card" onclick="playVideo('${filename}', '${name}')">
                        <div class="thumb">🎬</div>
                        <h4>${name}</h4>
                        <p>Episode ${i+1} • ${filename.split('.').pop().toUpperCase()}</p>
                    </div>
                `;
            }).join('');
            grid.innerHTML = cards;
            libGrid.innerHTML = cards;
        } else {
            grid.innerHTML = '<div class="loading"><i class="fas fa-folder-open"></i> No videos uploaded yet.</div>';
        }
    } catch (e) {
        grid.innerHTML = '<div class="loading"><i class="fas fa-exclamation-triangle" style="color:#ff6b6b;"></i> Failed to load videos.</div>';
        console.error(e);
    }
}

// ===== REQUEST FORM =====
document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('reqName').value;
    const title = document.getElementById('reqTitle').value;
    const type = document.getElementById('reqType').value;
    const desc = document.getElementById('reqDesc').value;

    const msg = `📩 *New Request!*\n\n👤 Name: ${name}\n📌 Title: ${title}\n📂 Type: ${type}\n📝 Details: ${desc}`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' })
        });
        document.getElementById('requestStatus').textContent = '✅ Your request successfully entered! We confirmed your query in 24 hrs.';
        document.getElementById('requestStatus').className = 'success';
        this.reset();
    } catch {
        document.getElementById('requestStatus').textContent = '❌ Error submitting request. Please try again.';
        document.getElementById('requestStatus').className = 'success';
    }
});

function scrollToContent() {
    document.getElementById('page-home').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('playerModal').addEventListener('click', function(e) {
    if (e.target === this) closePlayer();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePlayer();
});

loadVideos();
console.log('🎬 SHINJUKU AREAS • JJK S3 • By ~GpSirEra');
