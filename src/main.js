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
    newGameBtn.addEventListener('click', () => toggleSection(gameBoard));
    howToPlayBtn.addEventListener('click', () => toggleSection(howToPlay));
    backToMenuGameBtn.addEventListener('click', () => toggleSection(mainMenu));
    backToMenuBtnHow.addEventListener('click', () => toggleSection(mainMenu));

    // Function to Toggle Sections
    function toggleSection(section) {
        // Hide all sections
        [mainMenu, gameBoard, howToPlay].forEach(sec => sec.classList.add('hidden'));
        // Show the selected section
        section.classList.remove('hidden');
    }
});
