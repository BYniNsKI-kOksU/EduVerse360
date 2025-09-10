// about.js
// Provides showAboutInline() to display about content inside the single-page app
function showAboutInline() {
    const tpl = document.getElementById('tpl-about');
    if (!tpl) return console.warn('Template #tpl-about not found');

    document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => {
        if (el) el.style.display = 'none';
    });

    let container = document.getElementById('inlineAbout');
    if (!container) {
        container = document.createElement('div');
        container.id = 'inlineAbout';
        document.body.appendChild(container);
    }

    container.innerHTML = '';
    container.className = 'about-inline-container';

    // Create only the back button (no surrounding nav bar)
    const backButton = document.createElement('button');
    backButton.className = 'back-to-home';
    backButton.id = 'inlineAboutBack';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Powrót';
    container.appendChild(backButton);

    const content = tpl.content.cloneNode(true);
    container.appendChild(content);

    // apply style (in CSS we have #inlineAbout rules) - ensure full screen and scrollable
    container.style.display = 'block';

    // block body scrolling while inline page is open and add active class
    container._previousBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('about-active');

    // Back button handler
    const backBtn = document.getElementById('inlineAboutBack');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // remove container
            container.style.display = 'none';
            container.innerHTML = '';
            // restore body scroll and remove active class
            document.body.style.overflow = container._previousBodyOverflow;
            document.body.classList.remove('about-active');
            // show home screen
            document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => {
                if (el) el.style.display = '';
            });
            // call backToHome if exists
            if (typeof backToHome === 'function') backToHome();
        });
    }
}

// Expose helper
window.showAboutInline = showAboutInline;
