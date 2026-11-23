/* ===== Photos: add more by adding lines here (put files in /images) ===== */
const PHOTOS = [
  {src:'images/parineeti-temple-sunset.png', alt:'Parineeti at sunset'},
  {src:'images/parineeti-red-dress-sofa.png', alt:'Parineeti smiling on the sofa'}
];
const $ = s => document.querySelector(s);

/* Loader */
addEventListener('load', () => setTimeout(() => $('#loader').classList.add('gone'), 1300));

/* ===== Confetti canvas ===== */
const cv = $('#confetti'), cx = cv.getContext('2d'); let bits = [];
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; }; fit(); addEventListener('resize', fit);
function confetti(n = 160) {
  const cols = ['#e58aa8','#d9c9f2','#c9a45c','#fff','#f9d5e2','#b98ae0'];
  for (let i = 0; i < n; i++) bits.push({x:Math.random()*cv.width,y:-20,vx:Math.random()*4-2,vy:Math.random()*4+2,s:Math.random()*8+4,c:cols[i%cols.length],r:Math.random()*6});
  if (bits.length === n) loop();
}
function loop() {
  cx.clearRect(0,0,cv.width,cv.height);
  bits = bits.filter(b => b.y < cv.height + 20);
  bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.r += .1; cx.fillStyle = b.c; cx.save(); cx.translate(b.x,b.y); cx.rotate(b.r); cx.fillRect(-b.s/2,-b.s/4,b.s,b.s/2); cx.restore(); });
  if (bits.length) requestAnimationFrame(loop);
}
/* Floating emojis (hearts, flowers, butterflies) */
function floaters(set, n = 24) {
  for (let i = 0; i < n; i++) {
    const e = document.createElement('span'); e.className = 'fl';
    e.textContent = set[i % set.length]; e.style.left = Math.random()*95 + 'vw';
    e.style.fontSize = (18 + Math.random()*22) + 'px';
    e.style.animationDuration = (5 + Math.random()*5) + 's'; e.style.animationDelay = Math.random()*1.5 + 's';
    document.body.appendChild(e); setTimeout(() => e.remove(), 12000);
  }
}
const magic = () => { confetti(); floaters(['❤️','🌸','🌹','🦋','✨','💖']); };

/* ===== Music: soft music-box notes from Web Audio (no file, no autoplay) ===== */
let ac, timer, playing = false;
const notes = [523.25,587.33,659.25,783.99,880,783.99,659.25,587.33];
function startMusic() {
  ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); let i = 0; playing = true;
  timer = setInterval(() => {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = notes[i++ % notes.length] * (i % 16 > 8 ? .5 : 1);
    g.gain.setValueAtTime(.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(.08, ac.currentTime + .03); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 1.4);
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + 1.5);
  }, 650); $('#music').classList.remove('off');
}
function stopMusic() { clearInterval(timer); playing = false; $('#music').classList.add('off'); }
$('#music').onclick = () => playing ? stopMusic() : startMusic();
$('#music').classList.add('off');

/* ===== Open surprise ===== */
$('#openBtn').onclick = () => {
  magic(); $('#main').classList.add('show'); if (!playing) startMusic();
  setTimeout(() => $('#celebrate').scrollIntoView({behavior:'smooth'}), 600);
};
/* Cake: blow out / relight */
$('#cake').onclick = () => { $('#cake').classList.toggle('out'); if ($('#cake').classList.contains('out')) magic(); };
/* Envelope */
$('#env').onclick = e => { if (!e.target.closest('.paper')) $('#env').classList.toggle('open'); };

/* ===== Gallery: slideshow + grid ===== */
let cur = 0; const img = $('#slideImg');
function show(i) {
  cur = (i + PHOTOS.length) % PHOTOS.length; img.style.opacity = 0;
  setTimeout(() => { img.src = PHOTOS[cur].src; img.alt = PHOTOS[cur].alt; img.style.opacity = 1; }, 300);
}
show(0); $('#prev').onclick = () => show(cur - 1); $('#next').onclick = () => show(cur + 1);
setInterval(() => show(cur + 1), 5000);
PHOTOS.forEach(p => { const f = document.createElement('div'); f.className = 'frame'; f.innerHTML = `<img src="${p.src}" alt="${p.alt}" loading="lazy">`; $('#grid').appendChild(f); });
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), {threshold:.2});
document.querySelectorAll('.grid .frame').forEach(f => io.observe(f));

/* ===== Surprises ===== */
const MSG = {wish:'May all your wishes find their way to reality!', happy:'You deserve all the happiness in the world. Never forget how special you are!', magic:''};
document.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
  const k = b.dataset.s, m = $('#msg'); m.textContent = MSG[k];
  if (k === 'wish') { floaters(['⭐','✨','🌟','💫'], 30); } else if (k === 'happy') { floaters(['❤️','💖','💗'], 20); } else magic();
});
