document.addEventListener('DOMContentLoaded', () => {
    // Main (Includes Restart Button and Back Buttons)
    
    // DOM Elements
    const mainMenu = document.getElementById('main-menu');
    const gameBoard = document.getElementById('game-board');
    const howToPlay = document.getElementById('how-to-play');

    // Buttons
    const newGameBtn = document.getElementById('new-game-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const backToMenuGameBtn = document.getElementById('back-to-menu-btn');
    const backToMenuBtnHow = document.getElementById('back-to-menu-btn-how');

    // Event Listeners
    newGameBtn.addEventListener('click', () => {
        toggleSection(gameBoard);
        console.log('New Game button clicked'); // Debugging log
        // Placeholder for initializing the game grid
    });

    howToPlayBtn.addEventListener('click', () => {
        toggleSection(howToPlay);
        console.log('How to Play button clicked'); // Debugging log
    });

    backToMenuGameBtn.addEventListener('click', () => {
        toggleSection(mainMenu);
        console.log('Back to Menu button clicked (from Game Board)'); // Debugging log
    });

    backToMenuBtnHow.addEventListener('click', () => {
        toggleSection(mainMenu);
        console.log('Back to Menu button clicked (from How to Play)'); // Debugging log
    });

    // Function to Toggle Sections
    function toggleSection(section) {
        // Hide all sections
        [mainMenu, gameBoard, howToPlay].forEach(sec => sec.classList.add('hidden'));
        // Show the selected section
        section.classList.remove('hidden');
    }
});
