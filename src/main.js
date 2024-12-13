document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mainMenu = document.getElementById('main-menu');
    const gameBoard = document.getElementById('game-board');
    const howToPlay = document.getElementById('how-to-play');
    const popupModal = document.getElementById('popup-modal');
    const newGamePopupModal = document.getElementById('new-game-popup-modal'); // New popup for confirmation

    // Buttons
    const newGameBtn = document.getElementById('new-game-btn');
    const continueGameBtn = document.getElementById('continue-game-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const backToMenuGameBtn = document.getElementById('back-to-menu-btn');
    const backToMenuBtnHow = document.getElementById('back-to-menu-btn-how');
    const popupYesBtn = document.getElementById('popup-yes-btn');
    const popupNoBtn = document.getElementById('popup-no-btn');
    const newGameYesBtn = document.getElementById('new-game-yes-btn'); // Yes button in the new game popup
    const newGameNoBtn = document.getElementById('new-game-no-btn'); // No button in the new game popup

    const gridContainer = document.getElementById('grid-container');

    localStorage.removeItem('gameInProgress'); // To hide the continue game button

    // Game state
    let gameInProgress = localStorage.getItem('gameInProgress') === 'true'; // Load state from localStorage

    // Function to disable all main menu buttons
    function disableMainMenuButtons() {
        const mainMenuButtons = [newGameBtn, continueGameBtn, howToPlayBtn];
        mainMenuButtons.forEach(btn => btn.classList.add('unclickable'));
    }

    // Function to enable all main menu buttons
    function enableMainMenuButtons() {
        const mainMenuButtons = [newGameBtn, continueGameBtn, howToPlayBtn];
        mainMenuButtons.forEach(btn => btn.classList.remove('unclickable'));
    }

    // Event Listeners
    newGameBtn.addEventListener('click', () => {
        if (gameInProgress) {
            showNewGamePopup(); // Show the confirmation popup
        } else {
            startNewGame(); // If no game in progress, start a new game immediately
        }
    });

    continueGameBtn.addEventListener('click', () => {
        if (gameInProgress) {
            toggleSection(gameBoard);
            console.log('Continuing previous game');
        } else {
            console.error('No game to continue!');
        }
    });

    howToPlayBtn.addEventListener('click', () => {
        toggleSection(howToPlay);
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
        gameInProgress = true; // Ensure game state persists if "Yes" is clicked
        saveGameState();
        updateMainMenuButtons();
        console.log('Returning to Main Menu');
    });

    newGameNoBtn.addEventListener('click', () => {
        hideNewGamePopup(); // If user cancels, hide the popup
        enableMainMenuButtons(); // Re-enable the main menu buttons
    });

    newGameYesBtn.addEventListener('click', () => {
        hideNewGamePopup();
        startFreshGame(); // Start a completely fresh game
    });

    // Function to Show New Game Popup
    function showNewGamePopup() {
        newGamePopupModal.classList.remove('hidden');
        gameBoard.classList.add('unclickable'); // Prevent interactions with the game board
        disableMainMenuButtons(); // Disable main menu buttons
        mainMenu.classList.add('unclickable'); // Disable main menu interactions
    }

    // Function to Hide New Game Popup
    function hideNewGamePopup() {
        newGamePopupModal.classList.add('hidden');
        gameBoard.classList.remove('unclickable');
        mainMenu.classList.remove('unclickable'); // Re-enable main menu
    }


    // Function to Start New Game
    function startNewGame() {
        toggleSection(gameBoard);
        initializeGrid(gridContainer); // Initialize the game grid when new game starts
        shuffleTiles(gridContainer); // Shuffle tiles for the new game
        gameInProgress = true; // Game is now in progress
        saveGameState(); // Save the state
        updateMainMenuButtons();
        history.pushState({ section: 'game' }, '', '#game');
    }

    // Function to Start a Fresh Game (without tracking the previous puzzle data)
    function startFreshGame() {
        toggleSection(gameBoard); // Switch to the game board view
        initGrid(); // Reinitialize the grid
        shuffleTiles(gridContainer); // Shuffle tiles for the new game
        updateMainMenuButtons(); // Update main menu buttons to reflect no progress
        history.pushState({ section: 'game' }, '', '#game'); // Update history state
    }

    // Function to Shuffle Tiles
    function shuffleTiles(gridContainer) {
        const tiles = Array.from(gridContainer.children);
        const shuffledTiles = tiles.sort(() => Math.random() - 0.5); // Shuffle tiles randomly
        gridContainer.innerHTML = ''; // Clear the container
        shuffledTiles.forEach(tile => gridContainer.appendChild(tile)); // Re-add shuffled tiles
    }

    // Function to Toggle Sections
    function toggleSection(section) {
        [mainMenu, gameBoard, howToPlay].forEach(sec => sec.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    // Function to Show Popup
    function showPopup() {
        popupModal.classList.remove('hidden');
        gameBoard.classList.add('unclickable');
        mainMenu.classList.add('unclickable'); // Disable main menu buttons when the popup is active
    }

    // Function to Hide Popup
    function hidePopup() {
        popupModal.classList.add('hidden');
        gameBoard.classList.remove('unclickable');
        mainMenu.classList.remove('unclickable'); // Re-enable main menu buttons when the popup is hidden
    }

    // Function to Update Main Menu Buttons
    function updateMainMenuButtons() {
        if (gameInProgress) {
            continueGameBtn.classList.remove('hidden');
        } else {
            continueGameBtn.classList.add('hidden');
        }
    }

    // Function to Save Game State
    function saveGameState() {
        localStorage.setItem('gameInProgress', gameInProgress);
    }

    // Ensure Continue Game Button is Hidden on Initial Load if No Game
    if (!gameInProgress) {
        continueGameBtn.classList.add('hidden');
    }

    // Initialize state
    updateMainMenuButtons();
});
