document.addEventListener('DOMContentLoaded', () => {

    const toggleBtn = document.querySelector('.toggle-info-btn');
    const infoPanel = document.querySelector('#info-panel');

    // Verifica se os elementos existem na página antes de adicionar o evento
    if (toggleBtn && infoPanel) {

        toggleBtn.addEventListener('click', () => {
            // Adiciona/remove a classe 'is-open' do botão e do painel
            toggleBtn.classList.toggle('is-open');
            infoPanel.classList.toggle('is-open');

            // Atualiza o atributo aria-expanded para acessibilidade
            const isExpanded = infoPanel.classList.contains('is-open');
            toggleBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Funcionalidade "Voltar ao Topo"
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // Language Toggle Functionality
    const langBtns = document.querySelectorAll('.lang-btn');
    const langContents = document.querySelectorAll('.lang-content');

    console.log("Language Toggle: Found", langBtns.length, "buttons and", langContents.length, "content blocks");

    if (langBtns.length > 0 && langContents.length > 0) {
        langBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetLang = this.getAttribute('data-lang-target');
                console.log("Switching to language:", targetLang);

                // Update button states
                langBtns.forEach(b => {
                    if (b.getAttribute('data-lang-target') === targetLang) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });

                // Update content visibility
                langContents.forEach(content => {
                    if (content.getAttribute('data-lang') === targetLang) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });
            });
        });
    }
});