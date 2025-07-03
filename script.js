// On attend que le contenu de la page soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    
    // On vérifie sur quelle page on se trouve
    // Si l'élément #games-grid existe, on est sur la page d'accueil
    if (document.getElementById('games-grid')) {
        loadGamesIndex();
    }

    // Si l'élément #game-details-container existe, on est sur une page de jeu
    if (document.getElementById('game-details-container')) {
        loadGameDetails();
    }
});

/**
 * Charge et affiche la grille des jeux sur la page d'accueil (index.html)
 */
async function loadGamesIndex() {
    try {
        const response = await fetch('data.json'); // Charge le fichier data.json
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // On récupère l'objet entier
        const games = data.games;  // On extrait la liste de jeux

        const grid = document.getElementById('games-grid');
        grid.innerHTML = ''; // Vide la grille des exemples en dur

        games.forEach(game => {
            // Pour chaque jeu, on crée une carte HTML
            const card = `
                <a href="jeu.html?id=${game.id}" class="game-card">
                    <img src="${game.image}" alt="Image du jeu ${game.name}">
                    <div class="card-title">
                        <h3>${game.name}</h3>
                    </div>
                </a>
            `;
            grid.innerHTML += card; // Ajoute la carte à la grille
        });
    } catch (error) {
        console.error("Erreur lors du chargement des jeux:", error);
        document.getElementById('games-grid').innerHTML = "<p>Impossible de charger la liste des jeux. Veuillez réessayer plus tard.</p>";
    }
}

/**
 * Charge et affiche les détails d'un jeu spécifique sur la page de jeu (jeu.html)
 */
async function loadGameDetails() {
    // Récupère l'ID du jeu depuis l'URL (ex: ?id=dnd5)
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        window.location.href = 'index.html'; // Si pas d'ID, on retourne à l'accueil
        return;
    }
    
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // On récupère l'objet entier
        const games = data.games; // On extrait la liste de jeux

        // Trouve le jeu qui correspond à l'ID dans notre "base de données"
        const game = games.find(g => g.id === gameId);

        if (!game) {
            document.getElementById('game-title').textContent = "Jeu non trouvé";
            return;
        }

        // Met à jour la page avec les informations du jeu trouvé
        document.title = game.name; // Met à jour le titre de l'onglet du navigateur
        document.getElementById('game-title').textContent = game.name;
        document.getElementById('game-header-image').style.backgroundImage = `url('${game.image}')`;

        const list = document.getElementById('document-list');
        list.innerHTML = ''; // Vide la liste d'exemples

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