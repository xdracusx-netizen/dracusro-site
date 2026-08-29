/* ============================================================
   DracusRO cosmetics catalogue

   TO ADD AN ITEM: add one object to ITEMS below. Nothing else.

   Files go on Cloudflare R2 at MEDIA_BASE, named after the id:
     <id>.mp4    H.264, no audio, 3-6s seamless loop, ~600x600
     <id>.webm   VP9, same clip (optional but smaller)
     <id>.jpg    poster frame, shown before the video loads

   Videos are NOT loaded until they scroll into view, so a long
   catalogue costs nothing on a phone.
   ============================================================ */

const MEDIA_BASE = 'https://media.dracusro.com/shop/';
const POD_PER_USD = 2;   // 2 PoD = $1

const SLOTS = ['Headgear', 'Garment', 'Aura', 'Emblem'];

const ITEMS = [
  // { id:'crown-of-ash', name:'Crown of Ash', slot:'Headgear', pod:12,
  //   desc:'Slow-drifting embers. Sits above the eyes.' },
];

/* ---------------------------------------------------------- */

const wares   = document.getElementById('wares');
const filters = document.getElementById('filters');
const empty   = document.getElementById('empty');

function usd(pod) {
  const n = pod / POD_PER_USD;
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

function card(item) {
  const el = document.createElement('article');
  el.className = 'ware';
  el.dataset.slot = item.slot;

  el.innerHTML = `
    <div class="ware-media">
      <video muted loop playsinline preload="none"
             poster="${MEDIA_BASE}${item.id}.jpg"
             aria-label="${item.name} preview">
        <source data-src="${MEDIA_BASE}${item.id}.webm" type="video/webm">
        <source data-src="${MEDIA_BASE}${item.id}.mp4"  type="video/mp4">
      </video>
    </div>
    <div class="ware-body">
      <p class="ware-slot">${item.slot}</p>
      <h3>${item.name}</h3>
      ${item.desc ? `<p class="ware-desc">${item.desc}</p>` : ''}
      <p class="ware-price"><b>${item.pod}</b> PoD <span>${usd(item.pod)}</span></p>
    </div>`;
  return el;
}

function render(slot) {
  wares.innerHTML = '';
  const list = slot === 'All' ? ITEMS : ITEMS.filter(i => i.slot === slot);
  list.forEach(i => wares.appendChild(card(i)));
  observeVideos();
}

/* Only load and play what is actually on screen. */
let io;
function observeVideos() {
  if (io) io.disconnect();
  io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          v.querySelectorAll('source').forEach(s => { s.src = s.dataset.src; });
          v.load();
          v.dataset.loaded = '1';
        }
        v.play().catch(() => {});   // some browsers refuse; poster stays, which is fine
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.1 });

  document.querySelectorAll('.ware video').forEach(v => io.observe(v));
}

function buildFilters() {
  const present = SLOTS.filter(s => ITEMS.some(i => i.slot === s));
  if (!present.length) return;

  ['All', ...present].forEach((slot, idx) => {
    const b = document.createElement('button');
    b.className = 'filter' + (idx === 0 ? ' on' : '');
    b.textContent = slot;
    b.onclick = () => {
      document.querySelectorAll('.filter').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      render(slot);
    };
    filters.appendChild(b);
  });
}

if (ITEMS.length) {
  empty.style.display = 'none';
  buildFilters();
  render('All');
}
