
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

document.getElementById('locationButton').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map)
                .bindPopup("You are here")
                .openPopup();
            showNotification(`Your location: Latitude: ${lat}, Longitude: ${lon}`);
        }, function () {
            showNotification("Unable to retrieve your location.");
        });
    } else {
        showNotification("Geolocation is not supported by this browser.");
    }
});

document.getElementById('downloadMapButton').addEventListener('click', function () {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error generating map image", err);
            return;
        }

        const mapImage = document.getElementById('mapImage');
        mapImage.src = canvas.toDataURL();
        mapImage.style.display = 'block';

        splitMapIntoPuzzle(canvas);
    });
});

function splitMapIntoPuzzle(canvas) {
    const puzzleArea = document.getElementById('puzzleArea');
    const solutionArea = document.getElementById('solutionArea');
    puzzleArea.innerHTML = '';
    solutionArea.innerHTML = '';
    const pieceWidth = canvas.width / 4;
    const pieceHeight = canvas.height / 4;

    const pieces = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
            piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
            piece.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            piece.draggable = true;
            piece.dataset.row = row;
            piece.dataset.col = col;

            pieces.push(piece);
            puzzleArea.appendChild(piece);
            piece.addEventListener('dragstart', handleDragStart);

            const slot = document.createElement('div');
            slot.classList.add('solution-slot');
            slot.dataset.row = row;
            slot.dataset.col = col;
            solutionArea.appendChild(slot);
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('drop', handleDrop);
        }
    }

    pieces.forEach(piece => {
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (puzzleArea.offsetWidth - pieceWidth)}px`;
        piece.style.top = `${Math.random() * (puzzleArea.offsetHeight - pieceHeight)}px`;
    });
}

let draggedPiece = null;

function handleDragStart(e) {
    draggedPiece = e.target;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const targetSlot = e.target;

    if (targetSlot.classList.contains('solution-slot') || targetSlot.id === 'puzzleArea') {
        if (targetSlot.classList.contains('solution-slot') && targetSlot.firstChild) {
            const oldPiece = targetSlot.firstChild;
            document.getElementById('puzzleArea').appendChild(oldPiece);
            oldPiece.style.position = 'absolute';
        }

        targetSlot.appendChild(draggedPiece);
        draggedPiece.style.position = 'relative';
        draggedPiece.style.left = '0';
        draggedPiece.style.top = '0';

        checkPlacement(draggedPiece, targetSlot);
        checkPuzzleCompletion();
    }
}

function checkPlacement(piece, slot) {
    const pieceRow = piece.dataset.row;
    const pieceCol = piece.dataset.col;
    const slotRow = slot.dataset.row;
    const slotCol = slot.dataset.col;

    if (pieceRow == slotRow && pieceCol == slotCol) {
        console.log(`Piece [${pieceRow}, ${pieceCol}] is correctly placed.`);
    } else {
        console.log(`Piece [${pieceRow}, ${pieceCol}] is incorrectly placed.`);
    }
}

function checkPuzzleCompletion() {
    const slots = document.querySelectorAll('.solution-slot');
    let isComplete = true;

    slots.forEach(slot => {
        const piece = slot.firstChild;
        if (piece) {
            const pieceRow = piece.dataset.row;
            const pieceCol = piece.dataset.col;
            const slotRow = slot.dataset.row;
            const slotCol = slot.dataset.col;
            if (pieceRow != slotRow || pieceCol != slotCol) {
                isComplete = false;
            }
        } else {
            isComplete = false;
        }
    });

    if (isComplete) {
        showNotification("Congratulations! The puzzle is completed.");
        showSystemNotification("Congratulations! The puzzle is completed.");
        console.log("Congratulations! The puzzle is completed.");
    }
}

function showNotification(message) {
    const notificationArea = document.getElementById('notificationArea');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notificationArea.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showSystemNotification(message) {
    if (!("Notification" in window)) {
        console.log("This browser does not support system notifications.");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}