// instructions.js
// Provides showInstructionsInline() to display instructions content inside the single-page app
function showInstructionsInline() {
    const tpl = document.getElementById('tpl-instructions');
    if (!tpl) return console.warn('Template #tpl-instructions not found');

    document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => {
        if (el) el.style.display = 'none';
    });

    let container = document.getElementById('inlineInstructions');
    if (!container) {
        container = document.createElement('div');
        container.id = 'inlineInstructions';
        document.body.appendChild(container);
    }

    container.innerHTML = '';
    container.className = 'instructions-inline-container';

    // Create only the back button (no surrounding nav bar)
    const backButton = document.createElement('button');
    backButton.className = 'back-to-home';
    backButton.id = 'inlineInstructionsBack';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Powrót';
    container.appendChild(backButton);

    const content = tpl.content.cloneNode(true);
    container.appendChild(content);

    container.style.display = 'block';

    // block body scrolling while inline page is open and add active class
    container._previousBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('instructions-active');

    // init FAQ toggles
    container.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            if (item) item.classList.toggle('active');
        });
    });

    const backBtn = document.getElementById('inlineInstructionsBack');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            container.style.display = 'none';
            container.innerHTML = '';
            // restore body scroll and remove active class
            document.body.style.overflow = container._previousBodyOverflow;
            document.body.classList.remove('instructions-active');
            document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => {
                if (el) el.style.display = '';
            });
            if (typeof backToHome === 'function') backToHome();
        });
    }
}

window.showInstructionsInline = showInstructionsInline;
