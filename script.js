// On attend que le contenu de la page soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    // Si on est sur la page d'accueil
    if (document.getElementById('games-grid')) {
        loadHomepageContent(); 
    }

    // Si on est sur une page de jeu
    if (document.getElementById('game-details-container')) {
        loadGameDetails();
    }
});

/**
 * Charge tout le contenu de data.json et le distribue aux fonctions d'affichage.
 */
async function loadHomepageContent() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Contient { games: [...], apps: [...] }

        // On vérifie que les clés existent avant d'appeler les fonctions
        if (data.games) {
            displayGames(data.games);
        }
        if (data.apps) {
            displayApps(data.apps);
        }

    } catch (error) {
        console.error("Erreur lors du chargement du contenu de la page d'accueil:", error);
        document.getElementById('games-grid').innerHTML = "<p>Impossible de charger le contenu. Veuillez réessayer plus tard.</p>";
    }
}

/**
 * Affiche la grille des jeux.
 * @param {Array} games - Le tableau des objets de jeu.
 */
function displayGames(games) {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';

    if (!games || games.length === 0) {
        grid.innerHTML = "<p>Aucun jeu trouvé.</p>";
        return;
    }

    games.forEach(game => {
        const card = `
            <a href="jeu.html?id=${game.id}" class="game-card">
                <img src="${game.image}" alt="Image du jeu ${game.name}">
                <div class="card-title">
                    <h3>${game.name}</h3>
                </div>
            </a>
        `;
        grid.innerHTML += card;
    });
}

/**
 * Affiche la liste des applications.
 * @param {Array} apps - Le tableau des objets d'application.
 */
function displayApps(apps) {
    const listContainer = document.getElementById('apps-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (!apps || apps.length === 0) {
        return; // On n'affiche rien si la liste est vide.
    }
    
    apps.forEach(app => {
        const appItem = `
            <a href="${app.url}" class="app-item" target="_blank" rel="noopener noreferrer">
                <img src="${app.icon || 'assets/images/default-icon.png'}" alt="Icône de ${app.name}">
                <div class="app-item-info">
                    <h4>${app.name}</h4>
                    <p>${app.description}</p>
                </div>
            </a>
        `;
        listContainer.innerHTML += appItem;
    });
}

/**
 * Charge et affiche les détails d'un jeu spécifique sur la page de jeu (jeu.html).
 */
async function loadGameDetails() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const games = data.games; // On extrait uniquement la liste de jeux

        const game = games.find(g => g.id === gameId);

        if (!game) {
            document.getElementById('game-title').textContent = "Jeu non trouvé";
            return;
        }

        document.title = game.name;
        document.getElementById('game-title').textContent = game.name;
        document.getElementById('game-header-image').style.backgroundImage = `url('${game.image}')`;

        const list = document.getElementById('document-list');
        list.innerHTML = '';

        if (game.documents && game.documents.length > 0) {
            game.documents.forEach(doc => {
                const docItem = `
                    <li class="document-item">
                        <span>${doc.title}</span>
                        <a href="${doc.file}" class="download-link" download>Télécharger</a>
                    </li>
                `;
                list.innerHTML += docItem;
            });
        } else {
            list.innerHTML = '<p>Aucun document disponible pour ce jeu.</p>';
        }
    } catch (error) {
        console.error("Erreur lors du chargement des détails du jeu:", error);
        document.getElementById('game-details-container').innerHTML = "<p>Impossible de charger les détails de ce jeu.</p>";
    }
}