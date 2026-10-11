const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
const caption = document.querySelector('#image-caption');
document.querySelectorAll('[data-image]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialogImage.src = link.href;
    dialogImage.alt = link.dataset.caption;
    caption.textContent = link.dataset.caption;
    dialog.showModal();
    dialog.scrollTop = 0;
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.querySelector('#print-button').addEventListener('click', async () => {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
  await document.fonts.ready;
  await Promise.all(Array.from(document.images, img => img.decode().catch(() => {})));
  window.print();
});
