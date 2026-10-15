const artworks = [
  { title: 'After Hours', kicker: 'STUDY 01 / WARMTH', description: 'A little golden light, held against the last blue of the evening.', src: 'artworks/after-hours.svg', alt: 'Abstract artwork with a glowing amber circle and deep burgundy shapes' },
  { title: 'Blue Note', kicker: 'STUDY 02 / RHYTHM', description: 'A midnight composition in electric blue, brass, and a slow pulse of light.', src: 'artworks/blue-note.svg', alt: 'Abstract blue artwork with a gold crescent and rhythmic curved lines' },
  { title: 'Velvet Room', kicker: 'STUDY 03 / SHADOW', description: 'Soft curves and scarlet shadows gather like a song in the corner.', src: 'artworks/velvet-room.svg', alt: 'Abstract artwork with overlapping burgundy arches and a warm central glow' },
  { title: 'Golden Hourglass', kicker: 'STUDY 04 / TIME', description: 'An arrangement of warm geometry caught between stillness and motion.', src: 'artworks/golden-hourglass.svg', alt: 'Abstract artwork with hourglass-like ochre shapes against black' },
  { title: 'Last Call', kicker: 'STUDY 05 / GLOW', description: 'The final note hangs in the air while the city lights begin to blur.', src: 'artworks/last-call.svg', alt: 'Abstract artwork with glowing orange forms and violet night colors' }
];

const stage = document.querySelector('#carousel-stage');
const track = document.querySelector('#coverflow-track');
const title = document.querySelector('#artwork-title');
const kicker = document.querySelector('#artwork-kicker');
const description = document.querySelector('#artwork-description');
const current = document.querySelector('#slide-current');
const dots = document.querySelector('#carousel-dots');
let index = 0;
let dragStart = null;

artworks.forEach((artwork, position) => {
  const frame = document.createElement('div');
  frame.className = 'artwork-wrap';
  const image = document.createElement('img');
  image.src = artwork.src;
  image.width = 720;
  image.height = 900;
  image.draggable = false;
  frame.append(image);
  track.append(frame);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dot';
  button.setAttribute('aria-label', `Show artwork ${position + 1}: ${artwork.title}`);
  button.addEventListener('click', () => showArtwork(position));
  dots.append(button);
});

function showArtwork(position) {
  index = (position + artworks.length) % artworks.length;
  const artwork = artworks[index];
  title.textContent = artwork.title;
  kicker.textContent = artwork.kicker;
  description.textContent = artwork.description;
  current.textContent = String(index + 1).padStart(2, '0');
  [...dots.children].forEach((dot, dotIndex) => {
    dot.setAttribute('aria-current', String(dotIndex === index));
  });
  [...track.children].forEach((frame, frameIndex) => {
    let distance = frameIndex - index;
    if (distance > artworks.length / 2) distance -= artworks.length;
    if (distance < -artworks.length / 2) distance += artworks.length;
    frame.dataset.position = String(distance);
    frame.setAttribute('aria-hidden', String(distance !== 0));
    frame.querySelector('img').alt = distance === 0 ? artworks[frameIndex].alt : '';
  });
}

document.querySelector('#previous').addEventListener('click', () => showArtwork(index - 1));
document.querySelector('#next').addEventListener('click', () => showArtwork(index + 1));
stage.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showArtwork(index - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showArtwork(index + 1); }
});
stage.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  dragStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  if (event.pointerType === 'mouse') stage.classList.add('is-dragging');
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointerup', (event) => {
  if (!dragStart || dragStart.id !== event.pointerId) return;
  const distanceX = event.clientX - dragStart.x;
  const distanceY = event.clientY - dragStart.y;
  if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
    showArtwork(index + (distanceX < 0 ? 1 : -1));
  }
  dragStart = null;
  stage.classList.remove('is-dragging');
});
stage.addEventListener('pointercancel', () => {
  dragStart = null;
  stage.classList.remove('is-dragging');
});
stage.addEventListener('dragstart', (event) => event.preventDefault());

showArtwork(0);
