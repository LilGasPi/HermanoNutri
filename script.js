/* ============================================================
   Savia Nutrición — Interactividad
   ============================================================ */

// Inicializa animaciones de scroll (AOS)
AOS.init({ duration: 700, once: true, offset: 60 });

// ===== Navbar dinámico (cambia de estilo al hacer scroll) =====
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('bg-transparent');
    navbar.classList.add('bg-cream-50/95', 'backdrop-blur-sm');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.remove('bg-cream-50/95', 'backdrop-blur-sm');
    navbar.classList.add('bg-transparent');
  }
}
window.addEventListener('scroll', handleScroll);
handleScroll();

// ===== Menú hamburguesa (móvil) =====
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('open');
  const isOpen = hamburgerBtn.classList.contains('open');
  if (isOpen) {
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    mobileMenu.style.opacity = '1';
  } else {
    mobileMenu.style.maxHeight = '0';
    mobileMenu.style.opacity = '0';
  }
});

// Cierra el menú móvil al hacer click en un link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerBtn.classList.remove('open');
    mobileMenu.style.maxHeight = '0';
    mobileMenu.style.opacity = '0';
  });
});

// ===== Formulario de contacto conectado a Formspree =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('formSubmitBtn');
const btnText = document.getElementById('btnText');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  formSuccess.classList.add('hidden');
  formError.classList.add('hidden');

  const endpoint = form.getAttribute('data-endpoint');
  const data = {
    nombre: document.getElementById('nombre').value,
    correo: document.getElementById('correo').value,
    mensaje: document.getElementById('mensaje').value
  };

  // Estado de carga
  submitBtn.disabled = true;
  submitBtn.classList.add('opacity-80');
  btnText.textContent = 'Enviando...';
  submitBtn.insertAdjacentHTML('afterbegin', '<span class="spinner"></span>');

  try {
    if (!endpoint || endpoint.includes('TU_ENDPOINT_DE_FORMSPREE')) {
      // Aún no se ha configurado Formspree: modo demo
      await new Promise(res => setTimeout(res, 800));
      form.reset();
      formSuccess.classList.remove('hidden');
      console.warn('Formspree no configurado todavía: reemplaza data-endpoint en el <form>.');
    } else {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        form.reset();
        formSuccess.classList.remove('hidden');
      } else {
        formError.classList.remove('hidden');
      }
    }
  } catch (err) {
    formError.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-80');
    btnText.textContent = 'Enviar mensaje';
    const spinner = submitBtn.querySelector('.spinner');
    if (spinner) spinner.remove();
    setTimeout(() => { formSuccess.classList.add('hidden'); formError.classList.add('hidden'); }, 6000);
  }
});