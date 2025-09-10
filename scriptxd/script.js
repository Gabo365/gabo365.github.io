document.addEventListener('DOMContentLoaded', () => {
  // elementos principales
  const carousel = document.getElementById('carousel');
  const leftBtn = document.querySelector('.carousel-btn.left');
  const rightBtn = document.querySelector('.carousel-btn.right');
  const verMas = document.getElementById('verMas');
  const modal = document.getElementById('modal');
  const modalGrid = document.getElementById('modalGrid');
  const modalClose = document.querySelector('.modal-close');
  const modalBackdrop = document.getElementById('modalBackdrop');

  if (!carousel) {
    console.error('[carrusel] #carousel no encontrado — comprueba el HTML');
    return;
  }

  function getStep() {
    const card = carousel.querySelector('.card');
    const gapStr = getComputedStyle(carousel).getPropertyValue('gap') || '18';
    const gap = parseInt(gapStr, 10) || 18;
    return (card ? card.offsetWidth : 230) + gap;
  }

  // scroll
  leftBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });
  rightBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  // habilitar / deshabilitar botones
  function updateButtons() {
    if (!leftBtn || !rightBtn) return;
    const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    leftBtn.disabled = carousel.scrollLeft <= 8;
    rightBtn.disabled = carousel.scrollLeft >= maxScrollLeft - 8;
  }
  carousel.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rightBtn?.click();
    if (e.key === 'ArrowLeft') leftBtn?.click();
  });

  function populateModal() {
    if (!modalGrid) return;
    modalGrid.innerHTML = '';
    const cards = Array.from(carousel.querySelectorAll('.card'));
    cards.forEach(card => {
      const img = card.querySelector('img');
      const title = card.querySelector('.card-title')?.textContent || '';
      const mCard = document.createElement('div');
      mCard.className = 'm-card';
      const nImg = document.createElement('img');
      nImg.src = img?.src || '';
      nImg.alt = img?.alt || '';
      const h4 = document.createElement('h4');
      h4.textContent = title;
      mCard.appendChild(nImg);
      mCard.appendChild(h4);
      modalGrid.appendChild(mCard);

      nImg.addEventListener('click', () => {
        window.open(nImg.src, '_blank');
      });
    });
  }

  function openModal() {
    if (!modal) return;
    populateModal();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  verMas?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  carousel.addEventListener('pointerup', updateButtons);
  carousel.addEventListener('pointercancel', updateButtons);
  carousel.addEventListener('pointerleave', updateButtons);

  // init
  updateButtons();
});
