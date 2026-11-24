document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO MODAL DE LOGIN ---
    const openLoginBtn = document.getElementById('openLoginModal');
    const closeLoginBtn = document.getElementById('closeLoginModal');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');

    function abrirModalLogin() {
        if (!loginModal) return;
        loginModal.classList.remove('hidden');
        if (loginStatus) {
            loginStatus.classList.add('hidden');
            loginStatus.textContent = '';
        }
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) emailInput.focus();
    }

    function fecharModalLogin() {
        if (!loginModal) return;
        loginModal.classList.add('hidden');
    }

    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', abrirModalLogin);
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', fecharModalLogin);
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) fecharModalLogin();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const senha = document.getElementById('loginSenha').value;
            const erroEmail = document.getElementById('erroLoginEmail');
            const erroSenha = document.getElementById('erroLoginSenha');

            erroEmail.textContent = '';
            erroSenha.textContent = '';

            let valido = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                erroEmail.textContent = 'Digite um e-mail válido.';
                valido = false;
            }

            if (senha.length < 4) {
                erroSenha.textContent = 'Digite sua senha (mínimo de 4 caracteres).';
                valido = false;
            }

            if (valido) {
                // Ponto pronto para integrar sua autenticação real / API / Firebase
                localStorage.setItem('sessao_leitor_ia', JSON.stringify({
                    email,
                    logadoEm: new Date().toLocaleString('pt-BR')
                }));

                loginStatus.textContent = `Acesso liberado para ${email}.`;
                loginStatus.classList.remove('hidden');
            }
        });
    }

    // --- LÓGICA DA LANDING PAGE ---
    const form = document.getElementById('leadForm');
    if (!form) return;

    // 1. Captura o parâmetro 'origem' da URL (ex: ?origem=banner_artigo)
    const urlParams = new URLSearchParams(window.location.search);
    const origem = urlParams.get('origem') || 'acesso_direto';
    const origemInput = document.getElementById('origemLead');
    if (origemInput) origemInput.value = origem;

    // 2. Máscara automática para WhatsApp
    const whatsInput = document.getElementById('whatsapp');
    whatsInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }
        e.target.value = value;
    });

    // 3. Validação e Envio do Formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();

        let isValid = true;

        document.getElementById('erroNome').textContent = '';
        document.getElementById('erroEmail').textContent = '';
        document.getElementById('erroWhats').textContent = '';

        if (nome.length < 3) {
            document.getElementById('erroNome').textContent = 'Digite seu nome completo.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('erroEmail').textContent = 'Digite um e-mail válido.';
            isValid = false;
        }

        if (whatsapp.length < 14) {
            document.getElementById('erroWhats').textContent = 'Digite um número de WhatsApp válido com DDD.';
            isValid = false;
        }

        if (isValid) {
            const novoLead = {
                nome,
                email,
                whatsapp,
                origem,
                produto: 'IA na Prática',
                dataCadastro: new Date().toLocaleString('pt-BR')
            };

            const leadsSalvos = JSON.parse(localStorage.getItem('leads_capturados')) || [];
            leadsSalvos.push(novoLead);
            localStorage.setItem('leads_capturados', JSON.stringify(leadsSalvos));

            form.classList.add('hidden');
            const formTitle = document.querySelector('.lp-form-box h2');
            if (formTitle) formTitle.classList.add('hidden');
            document.getElementById('userNameSuccess').textContent = nome.split(' ')[0];
            document.getElementById('successBox').classList.remove('hidden');
        }
    });
});