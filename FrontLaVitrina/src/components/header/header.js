export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#agregarEstilos(shadow);
        this.#render(shadow);

        window.addEventListener('loginSuccess', (e) => {
            console.log("Header detectó login, actualizando...");
            this.#actualizarDatosUsuario(shadow, e.detail.usuario);
        });

        window.addEventListener('logout', () => {
            this.#actualizarDatosUsuario(shadow, null);
        });
    }

    #render(shadow) {
        const DEFAULT_AVATAR = './src/assets/imagenDefault.png';

        const usuarioStorage = localStorage.getItem('usuario');
        const usuario = usuarioStorage
            ? JSON.parse(usuarioStorage)
            : { nombres: 'Invitado', fotoPerfil: DEFAULT_AVATAR };

        const avatarUrl = usuario?.fotoPerfil?.trim()
            ? usuario.fotoPerfil
            : DEFAULT_AVATAR;



        const nombreUsuarioImprimir = usuario.nombres.length > 20
            ? usuario.nombres.slice(0, 20) + "..."
            : usuario.nombres;


        shadow.innerHTML += `
        <header class="main-header">
                <div class="search-bar">
                    <input class="search-input" placeholder="Buscar productos, servicios..." type="text">
                    <img class="search-icon" src="./src/assets/buscar.png" alt="icono buscar">
                </div>

                <div class="user-menu-container">
                    
                    <div class="user-info" id="userInfo">
                        <span class="user-name" id="userNameText">${nombreUsuarioImprimir}</span>
                        <img src="${avatarUrl}" alt="Perfil" class="user-avatar" id="userAvatarImg">
                    </div>

                    <div class="dropdown-menu" id="dropdownMenu">
                        
                        <div class="dropdown-item" id="btnPerfil">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Ver perfil</span>
                        </div>

                        <div class="dropdown-separator"></div>

                        <div class="dropdown-item" id="btnLogout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Cerrar sesión</span>
                        </div>

                    </div>
                </div>
        </header>
        `;

        this.#setupEventListeners(shadow);
    }

    #actualizarDatosUsuario(shadow, usuarioDatos) {
        const userNameText = shadow.getElementById('userNameText');
        const userAvatarImg = shadow.getElementById('userAvatarImg');
        const DEFAULT_AVATAR = './src/assets/imagendefault.png';

        if (usuarioDatos) {
            // Si hay usuario (Login)
            if (userNameText) userNameText.textContent = usuarioDatos.nombres;
            if (userAvatarImg) userAvatarImg.src = usuarioDatos.fotoPerfil || DEFAULT_AVATAR;
        } else {
            // Si es null (Logout)
            if (userNameText) userNameText.textContent = 'Invitado';
            if (userAvatarImg) userAvatarImg.src = DEFAULT_AVATAR;
        }
    }
    #setupEventListeners(shadow) {
        const userInfo = shadow.getElementById('userInfo');
        const dropdownMenu = shadow.getElementById('dropdownMenu');
        const btnPerfil = shadow.getElementById('btnPerfil');
        const btnLogout = shadow.getElementById('btnLogout');

        const searchInput = shadow.querySelector('.search-input');
        const searchIcon = shadow.querySelector('.search-icon');

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                dropdownMenu.classList.remove('active');

                console.log('Sesión cerrada correctamente');

                window.dispatchEvent(new CustomEvent('logout'));

                if (window.page) page('/iniciar-sesion');
                else window.location.href = '/iniciar-sesion';
            });
        }

        const dispararBusqueda = () => {
            const termino = searchInput.value;
            console.log('Buscando:', termino);

            const enHomePage = window.location.pathname.includes('/home-page');

            if (!enHomePage) {
                if (window.page) {
                    page('/home-page');

                    setTimeout(() => {
                        document.dispatchEvent(new CustomEvent('realizar-busqueda', {
                            detail: { termino: termino },
                            bubbles: true,
                            composed: true
                        }));
                    }, 100);
                    return;
                }
            }

            const eventoBusqueda = new CustomEvent('realizar-busqueda', {
                detail: { termino: termino },
                bubbles: true,
                composed: true
            });
            document.dispatchEvent(eventoBusqueda);
        };


        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    dispararBusqueda();
                }
            });
        }

        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                dispararBusqueda();
            });
        }

        if (userInfo) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });
        }

        if (btnPerfil) {
            btnPerfil.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
                if (window.page) page('/perfil');
            });
        }

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                dropdownMenu.classList.remove('active');
                console.log('Sesión cerrada correctamente');
                if (window.page) page('/iniciar-sesion');
                else window.location.href = '/iniciar-sesion';
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target !== this) {
                dropdownMenu.classList.remove('active');
            }
        });

        shadow.addEventListener('click', (e) => {
            if (!userInfo.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

    }

    #agregarEstilos(shadow) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./src/components/header/header.css");
        shadow.appendChild(link);
    }
}