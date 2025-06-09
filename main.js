let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i].classList.remove('active');
    dots[i].setAttribute('aria-selected', 'false');
  });
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  dots[index].setAttribute('aria-selected', 'true');
  currentSlide = index;
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}
function prevSlide() {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
}
function goToSlide(index) {
  showSlide(index);
  clearInterval(slideInterval);
  startAutoSlide();
}
function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 6000);
}

document.addEventListener('DOMContentLoaded', function() {
  showSlide(0);
  startAutoSlide();
});

const heroSection = document.querySelector('.hero');
heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
heroSection.addEventListener('mouseleave', startAutoSlide);

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
    clearInterval(slideInterval);
    startAutoSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
    clearInterval(slideInterval);
    startAutoSlide();
  }
});

function toggleTheme() {
  const body = document.body;
  const button = document.querySelector('.theme-toggle');
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    button.textContent = '🌙';
  } else {
    body.setAttribute('data-theme', 'dark');
    button.textContent = '☀️';
  }
}
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.setAttribute('data-theme', 'dark');
  document.querySelector('.theme-toggle').textContent = '☀️';
}

document.addEventListener("DOMContentLoaded", function() {
  const commentList = document.getElementById('comments-list');
  const nameInput = document.getElementById('comment-name');
  const msgInput = document.getElementById('comment-message');
  const submitBtn = document.getElementById('comment-submit');

  function addComment(name, msg) {
    const div = document.createElement('div');
    div.className = 'user-comment';
    div.innerHTML = `<span class="username">${name}</span><br>${msg}`;
    commentList.prepend(div);
  }

  submitBtn.addEventListener('click', function() {
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();
    if (!name || !msg) {
      if (!name) nameInput.style.borderColor = "#e96b6b";
      if (!msg) msgInput.style.borderColor = "#e96b6b";
      return;
    }
    addComment(name, msg);
    nameInput.value = '';
    msgInput.value = '';
    nameInput.style.borderColor = "";
    msgInput.style.borderColor = "";
  });
  [nameInput, msgInput].forEach(el => el.addEventListener('input', () => {
    el.style.borderColor = "";
  }));
});

function actualizaCuentaAtras() {
  const fechaEvento = new Date('2025-05-31T18:00:00'); 
  const ahora = new Date();
  const diff = fechaEvento - ahora;

  if (diff <= 0) {
    document.querySelector('.countdown-box').innerHTML = "<span style='font-size:2rem;color:var(--primary-green);'>¡El gran día ha llegado!</span>";
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  document.getElementById('dias').textContent = String(dias).padStart(2, '0');
  document.getElementById('horas').textContent = String(horas).padStart(2, '0');
  document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
  document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

setInterval(actualizaCuentaAtras, 1000);
document.addEventListener('DOMContentLoaded', actualizaCuentaAtras);

// ========== COMENTARIOS PHP ==========
async function cargarComentarios() {
  const resp = await fetch('comments.php');
  const comentarios = await resp.json();
  const lista = document.getElementById('comments-list');
  lista.innerHTML = '';
  comentarios.forEach(com => {
    lista.innerHTML += `
      <div class="user-comment">
        <div class="username">${com.name}</div>
        <div class="fecha" style="font-size:0.95em;color:#bbb;">${com.date}</div>
        <div class="texto">${com.text}</div>
      </div>
    `;
  });
}

document.getElementById('comment-form').addEventListener('submit', async function(e){
  e.preventDefault();
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  if (!name || !text) return;
  const resp = await fetch('comments.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, text })
  });
  const result = await resp.json();
  if (result.success) {
    document.getElementById('comment-form').reset();
    cargarComentarios();
  } else {
    alert(result.error || 'Error al enviar comentario');
  }
});

document.addEventListener('DOMContentLoaded', cargarComentarios);