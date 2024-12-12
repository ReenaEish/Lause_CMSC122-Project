document.addEventListener('DOMContentLoaded', () => {
    // Main (Includes Restart Button and Back Buttons)

    // DOM Elements
    const mainMenu = document.getElementById('main-menu');
    const gameBoard = document.getElementById('game-board');
    const howToPlay = document.getElementById('how-to-play');
    const popupModal = document.getElementById('popup-modal');

    // Buttons
    const newGameBtn = document.getElementById('new-game-btn');
    const continueGameBtn = document.getElementById('continue-game-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const backToMenuGameBtn = document.getElementById('back-to-menu-btn');
    const backToMenuBtnHow = document.getElementById('back-to-menu-btn-how');
    const popupYesBtn = document.getElementById('popup-yes-btn');
    const popupNoBtn = document.getElementById('popup-no-btn');

    // Grid container to pass to initializeGrid
    const gridContainer = document.getElementById('grid-container');

    // Game state
    let gameInProgress = false; // Tracks if a game is currently active

    // Event Listeners
    newGameBtn.addEventListener('click', () => {
        toggleSection(gameBoard);
        initializeGrid(gridContainer); // Initialize the game grid when new game starts
        gameInProgress = true; // Game is now in progress
        updateMainMenuButtons();

        // Add to browser history for back navigation
        history.pushState({ section: 'game' }, '', '#game');
    });

    continueGameBtn.addEventListener('click', () => {
        toggleSection(gameBoard);
        console.log('Continuing previous game');
    });

    howToPlayBtn.addEventListener('click', () => {
        toggleSection(howToPlay);

        // Add to browser history for back navigation
        history.pushState({ section: 'how-to-play' }, '', '#how-to-play');
    });

    backToMenuGameBtn.addEventListener('click', () => {
        showPopup();
    });

    backToMenuBtnHow.addEventListener('click', () => {
        toggleSection(mainMenu);
    });

    popupNoBtn.addEventListener('click', () => {
        hidePopup();
    });

    popupYesBtn.addEventListener('click', () => {
        hidePopup();
        toggleSection(mainMenu);
        console.log('Returning to Main Menu');
    });

    // Handle browser back button navigation
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            const section = event.state.section;
            if (section === 'game') {
                toggleSection(gameBoard);
            } else if (section === 'how-to-play') {
                toggleSection(howToPlay);
            } else {
                toggleSection(mainMenu);
            }
        } else {
            toggleSection(mainMenu); // Default to main menu if no state
        }
    });

    // Function to Toggle Sections
    function toggleSection(section) {
        // Hide all sections
        [mainMenu, gameBoard, howToPlay].forEach(sec => sec.classList.add('hidden'));
        // Show the selected section
        section.classList.remove('hidden');
    }

    // Function to Show Popup
    function showPopup() {
        popupModal.classList.remove('hidden');
        gameBoard.classList.add('unclickable'); // Prevent interactions with the game board
    }

    // Function to Hide Popup
    function hidePopup() {
        popupModal.classList.add('hidden');
        gameBoard.classList.remove('unclickable');
    }

    // Function to Update Main Menu Buttons
    function updateMainMenuButtons() {
        if (gameInProgress) {
            continueGameBtn.classList.remove('hidden');
        } else {
            continueGameBtn.classList.add('hidden');
        }
    }

    // Initialize state
    updateMainMenuButtons(); // Ensure Continue Game button is hidden initially
});
