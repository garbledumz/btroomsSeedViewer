class LCG {
    constructor(seed) {
        this.seed = seed;
    }

    nextInteger(min, max) {
        this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
        const range = max - min + 1;
        const value = Math.floor((this.seed / 2147483648) * range);
        return min + value;
    }
}

const floorConfigs = {
    A: {
        normalRooms: [
            'Bathroom-Subroom-Right',
            'Catwalk-Down-Long',
            'Catwalk-Up',
            'LShaped-Left',
            'Locker-Hallway',
            'Office-Subroom-Right',
            'Straight-Cubicles',
            'Straight-DoorLeft',
            'Straight-DoorLeft-Cubicle',
            'Straight-DoorRight',
            'Straight-Normal'
        ],
        a100Rooms: [
            'Cutoff-Right-Ruined',
            'Hallway-Flood',
            'Left-Wall-Broken',
            'Straight-Ruined',
            'Straight-Ruined-Roof'
        ],
        debugRoom100: 100,
        rareRoom: 999
    },
    C: {
        normalRooms: [
            'Outside-Straight',
            'Outside-Straight-BlockedTunnel',
            'Outside-Straight-Campsite',
            'Outside-Straight-Deep',
            'Outside-Straight-Waterfall'
        ],
        a100Rooms: [
            'Outside-Straight',
            'Outside-Straight-BlockedTunnel',
            'Outside-Straight-Campsite',
            'Outside-Straight-Deep',
            'Outside-Straight-Waterfall'
        ],
        debugRoom100: 999,
        rareRoom: 999
    },
    Retro: {
        normalRooms: [
            'Bathroom-Subroom-Left-Inverted',
            'Bathroom-Subroom-Right',
            'Catwalk-Down-Long',
            'Catwalk-Up',
            'LShaped-Left',
            'Locker-Hallway',
            'Office-Subroom-Right',
            'Straight-Cubicles',
            'Straight-DoorLeft',
            'Straight-DoorLeft-Cubicle',
            'Straight-DoorRight',
            'Straight-Normal'
        ],
        a100Rooms: [
            'Bathroom-Subroom-Left-Inverted',
            'Bathroom-Subroom-Right',
            'Catwalk-Down-Long',
            'Catwalk-Up',
            'LShaped-Left',
            'Locker-Hallway',
            'Office-Subroom-Right',
            'Straight-Cubicles',
            'Straight-DoorLeft',
            'Straight-DoorLeft-Cubicle',
            'Straight-DoorRight',
            'Straight-Normal'
        ],
        debugRoom100: 1900,
        rareRoom: 999
    },
    B: {
        normalRooms: [
            'Basement-Bathroom',
            'Basement-LargeSideRoom',
            'Basement-Straight',
            'Basement-Straight-Debug',
            'Basement-Straight-Ruined',
            'Basement-Straight-Swim'
        ],
        a100Rooms: [
            'Basement-Bathroom',
            'Basement-LargeSideRoom',
            'Basement-Straight',
            'Basement-Straight-Debug',
            'Basement-Straight-Ruined'
        ],
        debugRoom100: 999,
        rareRoom: 999
    }
};

const rareSeeds = [
    {
        seed: 800304795,
        name: "Nightmare Run",
        description: "Maximum moon size, with 4 JOKE ROOMS from 1-100.",
        floor: "A",
        moonSize: 12,
        easterEggs: 4,
        difficulty: "nightmare",
        rarity: "legendary"
    }
];

let searchRunning = false;
let searchCancelled = false;

function toggleRareSeeds() {
    const rareSection = document.getElementById('rareSeeds');
    rareSection.classList.toggle('visible');
    
    if (rareSection.classList.contains('visible')) {
        displayRareSeeds();
    }
}

function displayRareSeeds() {
    const grid = document.getElementById('rareSeedsGrid');
    grid.innerHTML = '';

    rareSeeds.forEach(rareSeed => {
        const card = document.createElement('div');
        card.className = `rare-seed-card ${rareSeed.difficulty}`;
        
        const difficultyLabel = {
            peaceful: 'Peaceful',
            easy: 'Easy',
            normal: 'Normal',
            hard: 'Hard',
            nightmare: 'DIFFICULT'
        }[rareSeed.difficulty] || 'Unknown';

        const rarityBadge = {
            common: 'Common',
            uncommon: 'Uncommon',
            rare: 'Rare',
            epic: 'Epic',
            legendary: 'ONE IN A MILLION'
        }[rareSeed.rarity] || '';

        card.innerHTML = `
            <div class="rare-seed-header">
                <div class="rare-seed-title">
                    <strong>${rareSeed.name}</strong>
                    <span class="rarity-badge ${rareSeed.rarity}">${rarityBadge}</span>
                </div>
                <span class="difficulty-badge ${rareSeed.difficulty}">${difficultyLabel}</span>
            </div>
            <div class="rare-seed-description">${rareSeed.description}</div>
            <div class="rare-seed-stats">
                <div class="rare-stat">
                    <span class="rare-stat-label">Seed</span>
                    <span class="rare-stat-value">${rareSeed.seed}</span>
                </div>
                <div class="rare-stat">
                    <span class="rare-stat-label">Floor</span>
                    <span class="rare-stat-value">${rareSeed.floor}</span>
                </div>
                <div class="rare-stat">
                    <span class="rare-stat-label">Moon</span>
                    <span class="rare-stat-value">${rareSeed.moonSize}</span>
                </div>
                <div class="rare-stat">
                    <span class="rare-stat-label">Easter Eggs</span>
                    <span class="rare-stat-value">${rareSeed.easterEggs}</span>
                </div>
                <p>Found by: @giggledumm</p>
            </div>
            <button class="load-rare-seed" data-seed="${rareSeed.seed}" data-floor="${rareSeed.floor}">Load Seed</button>
        `;
        
        grid.appendChild(card);
    });

    document.querySelectorAll('.load-rare-seed').forEach(btn => {
        btn.addEventListener('click', function() {
            loadRareSeed(parseInt(this.dataset.seed), this.dataset.floor, 100);
        });
    });
}

function loadRareSeed(seed, floor, roomCount) {
    document.getElementById('seed').value = seed;
    document.getElementById('floor').value = floor;
    document.getElementById('roomCount').value = roomCount;
    generateRooms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function simulateSeed(seed, floor, roomCount) {
    const rng = new LCG(seed);
    const moonSize = rng.nextInteger(3, 12);
    const config = floorConfigs[floor];
    
    let previousRoomName = '';
    let easterEggCount = 0;
    const roomCounts = {};

    const debugRoom1Spawn = floor === 'A' ? 1 : 999;
    const debugRoom60Spawn = floor === 'A' ? 60 : 999;
    const debugRoom100Spawn = config.debugRoom100;
    const a60willspawn = 12212;

    for (let i = 1; i <= roomCount; i++) {
        let roomName = '';

        if (i === a60willspawn || i === debugRoom100Spawn || i === debugRoom1Spawn || i === debugRoom60Spawn) {
            continue;
        } else {
            const easterEgg = rng.nextInteger(1, config.rareRoom);

            if (easterEgg === config.rareRoom) {
                easterEggCount++;
            } else {
                let SetRooms;
                if (i < debugRoom100Spawn) {
                    SetRooms = config.normalRooms;
                } else {
                    SetRooms = config.a100Rooms;
                }

                let randomRoom;
                let attempts = 0;
                do {
                    const idx = rng.nextInteger(1, SetRooms.length);
                    randomRoom = SetRooms[idx - 1];
                    attempts++;
                } while (randomRoom === previousRoomName && attempts < 10);

                previousRoomName = randomRoom;
                roomName = randomRoom;
                roomCounts[roomName] = (roomCounts[roomName] || 0) + 1;
            }
        }
    }

    return { moonSize, easterEggCount, roomCounts };
}

function toggleSeedFinder() {
    const finder = document.getElementById('seedFinder');
    finder.classList.toggle('visible');
}

async function startSeedSearch() {
    searchRunning = true;
    searchCancelled = false;
    
    document.getElementById('searchButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
    
    const floor = document.getElementById('finderFloor').value;
    const roomCount = parseInt(document.getElementById('finderRoomCount').value);
    const minEaster = parseInt(document.getElementById('minEasterEggs').value);
    const maxEaster = parseInt(document.getElementById('maxEasterEggs').value);
    const moonMin = parseInt(document.getElementById('moonSizeMin').value);
    const moonMax = parseInt(document.getElementById('moonSizeMax').value);
    const maxAttempts = parseInt(document.getElementById('maxAttempts').value);
    const targetRoom = document.getElementById('targetRoom').value.trim();
    const minTargetCount = parseInt(document.getElementById('minTargetCount').value);
    const seedMode = document.getElementById('seedMode').value;
    const customStart = parseInt(document.getElementById('customStart').value) || 1;

    const statusEl = document.getElementById('finderStatus');
    const resultsEl = document.getElementById('finderResults');
    resultsEl.innerHTML = '';

    const foundSeeds = [];
    let attempts = 0;
    let currentSeed = seedMode === 'sequential' ? 1 : (seedMode === 'custom' ? customStart : null);

    while (attempts < maxAttempts && !searchCancelled) {
        let testSeed;
        
        if (seedMode === 'random') {
            testSeed = Math.floor(Math.random() * 999999999) + 1;
        } else if (seedMode === 'sequential') {
            testSeed = currentSeed;
            currentSeed++;
            if (currentSeed > 999999999) {
                statusEl.textContent = 'Reached maximum seed value (999999999)';
                break;
            }
        } else if (seedMode === 'custom') {
            testSeed = currentSeed;
            currentSeed++;
            if (currentSeed > 999999999) {
                statusEl.textContent = 'Reached maximum seed value (999999999)';
                break;
            }
        }

        const result = simulateSeed(testSeed, floor, roomCount);

        const easterMatch = result.easterEggCount >= minEaster && result.easterEggCount <= maxEaster;
        const moonMatch = result.moonSize >= moonMin && result.moonSize <= moonMax;
        
        let targetMatch = true;
        if (targetRoom) {
            const count = result.roomCounts[targetRoom] || 0;
            targetMatch = count >= minTargetCount;
        }

        if (easterMatch && moonMatch && targetMatch) {
            foundSeeds.push({
                seed: testSeed,
                easterEggs: result.easterEggCount,
                moonSize: result.moonSize,
                targetCount: targetRoom ? (result.roomCounts[targetRoom] || 0) : 0
            });

            const seedCard = document.createElement('div');
            seedCard.className = 'seed-result-card';
            seedCard.innerHTML = `
                <div class="seed-result-header">
                    <strong>Seed: ${testSeed}</strong>
                    <button class="load-seed" data-seed="${testSeed}" data-floor="${floor}" data-count="${roomCount}">Load</button>
                </div>
                <div class="seed-result-stats">
                    Easter Eggs: ${result.easterEggCount} | Moon Size: ${result.moonSize}
                    ${targetRoom ? ` | ${targetRoom}: ${result.roomCounts[targetRoom] || 0}` : ''}
                </div>
            `;
            resultsEl.appendChild(seedCard);

            seedCard.querySelector('.load-seed').addEventListener('click', function() {
                loadSeed(parseInt(this.dataset.seed), this.dataset.floor, parseInt(this.dataset.count));
            });
        }

        attempts++;

        if (attempts % 100 === 0) {
            const modeText = seedMode === 'random' ? 'random' : `from ${seedMode === 'sequential' ? '1' : customStart}`;
            statusEl.textContent = `SEARCHING (${modeText}): Scanned ${attempts} seeds, found ${foundSeeds.length} matching... Current: ${testSeed}`;
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    const modeText = seedMode === 'random' ? 'random' : `sequential from ${seedMode === 'sequential' ? '1' : customStart}`;
    statusEl.textContent = `COMPLETED SEARCH (${modeText}): Attempts: ${attempts}, Found ${foundSeeds.length} matching.`;
    document.getElementById('searchButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
    searchRunning = false;
}

function stopSeedSearch() {
    searchCancelled = true;
}

function loadSeed(seed, floor, roomCount) {
    document.getElementById('seed').value = seed;
    document.getElementById('floor').value = floor;
    document.getElementById('roomCount').value = roomCount;
    generateRooms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateRooms() {
    const seed = parseInt(document.getElementById('seed').value);
    const floor = document.getElementById('floor').value;
    const roomCount = parseInt(document.getElementById('roomCount').value);

    if (!seed || seed < 1 || seed > 999999999) {
        alert('Enter a valid seed between 1 and 999999999');
        return;
    }

    if (!roomCount || roomCount < 1 || roomCount > 1000) {
        alert('Enter a valid room count between 1 and 1000');
        return;
    }

    const rng = new LCG(seed);
    const moonSize = rng.nextInteger(3, 12);
    const config = floorConfigs[floor];
    const rooms = [];
    let previousRoomName = '';
    let easterEggCount = 0;
    let majorRoomCount = 0;

    const debugRoom1Spawn = floor === 'A' ? 1 : 999;
    const debugRoom60Spawn = floor === 'A' ? 60 : 999;
    const debugRoom100Spawn = config.debugRoom100;
    const a60willspawn = 12212;

    for (let i = 1; i <= roomCount; i++) {
        let roomName = '';
        let roomType = 'normal';

        if (i === a60willspawn) {
            roomName = 'A-60 Room';
            roomType = 'special';
        } else {
            const easterEgg = rng.nextInteger(1, config.rareRoom);

            if (easterEgg === config.rareRoom) {
                roomName = 'Easter Egg / Joke Room';
                roomType = 'easter';
                easterEggCount++;
            } else if (i === debugRoom100Spawn) {
                roomName = 'Room 100 Checkpoint';
                roomType = 'major';
                majorRoomCount++;
            } else if (i === debugRoom1Spawn) {
                roomName = 'The Plaza (Room 1)';
                roomType = 'major';
                majorRoomCount++;
            } else if (i === debugRoom60Spawn) {
                roomName = 'A-60 Cameo (Room 60)';
                roomType = 'major';
                majorRoomCount++;
            } else {
                let SetRooms;
                if (i < debugRoom100Spawn) {
                    SetRooms = config.normalRooms;
                } else {
                    SetRooms = config.a100Rooms;
                }

                let randomRoom;
                let attempts = 0;
                do {
                    const idx = rng.nextInteger(1, SetRooms.length);
                    randomRoom = SetRooms[idx - 1];
                    attempts++;
                } while (randomRoom === previousRoomName && attempts < 10);

                previousRoomName = randomRoom;
                roomName = randomRoom;
            }
        }

        rooms.push({ number: i, name: roomName, type: roomType });
    }

    displayResults(rooms, easterEggCount, majorRoomCount, moonSize);
}

function displayResults(rooms, easterEggCount, majorRoomCount, moonSize) {
    document.getElementById('results').classList.add('visible');
    document.getElementById('totalRooms').textContent = rooms.length;
    document.getElementById('easterEggs').textContent = easterEggCount;
    document.getElementById('majorRooms').textContent = majorRoomCount;
    document.getElementById('moonSize').textContent = moonSize;
    
    const moonImage = document.getElementById('moonImage');
    const scaleFactor = moonSize / 7.5;
    moonImage.style.width = `${48 * scaleFactor}px`;
    moonImage.style.height = `${48 * scaleFactor}px`;

    const freq = {};
    rooms.forEach(r => {
        if (r.type === "normal") {
            freq[r.name] = (freq[r.name] || 0) + 1;
        }
    });

    let mostRoom = null, leastRoom = null;
    let mostCount = -1, leastCount = Infinity;

    for (const room in freq) {
        if (freq[room] > mostCount) {
            mostCount = freq[room];
            mostRoom = room;
        }
        if (freq[room] < leastCount) {
            leastCount = freq[room];
            leastRoom = room;
        }
    }

    const uniqueRooms = Object.keys(freq).length;
    const totalNormal = Object.values(freq).reduce((a, b) => a + b, 0);
    const uniqueness = Math.round((uniqueRooms / totalNormal) * 100);

    document.getElementById("mostCommonName").textContent = mostRoom || "—";
    document.getElementById("leastCommonName").textContent = leastRoom || "—";
    const mostImg = document.getElementById("mostCommonImg");
    const leastImg = document.getElementById("leastCommonImg");
    mostImg.src = mostRoom ? `roomImages/${mostRoom}.png` : "roomImages/placeholder.png";
    leastImg.src = leastRoom ? `roomImages/${leastRoom}.png` : "roomImages/placeholder.png";
    mostImg.onerror = function() { this.src = "roomImages/placeholder.png"; };
    leastImg.onerror = function() { this.src = "roomImages/placeholder.png"; };
    document.getElementById("uniquenessScore").textContent = `${uniqueness}%`;

    const grid = document.getElementById('roomGrid');
    grid.innerHTML = '';

    rooms.forEach(room => {
        const card = document.createElement('div');
        card.className = `room-card ${room.type}`;
        
        const imagePath = `roomImages/${room.name}.png`;
        
        card.innerHTML = `
            <img src="${imagePath}" alt="${room.name}" class="room-image" onerror="this.src='roomImages/placeholder.png'">
            <div class="room-content">
                <div class="room-number">Room ${room.number}</div>
                <div class="room-name">${room.name}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function randomSeed() {
    const min = 1; 
    const max = 999999;  
    const seedIDK = Math.floor(Math.random() * (max - min + 1)) + min;
    document.getElementById("seed").value = seedIDK;
    generateRooms();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateBtn').addEventListener('click', generateRooms);
    document.getElementById('randomBtn').addEventListener('click', randomSeed);
    document.getElementById('finderToggle').addEventListener('click', toggleSeedFinder);
    document.getElementById('rareSeedsToggle').addEventListener('click', toggleRareSeeds);
    document.getElementById('searchButton').addEventListener('click', startSeedSearch);
    document.getElementById('stopButton').addEventListener('click', stopSeedSearch);

    const seedParam = getParam("seed");
    const floorParam = getParam("floor");
    const roomsParam = getParam("rooms");

    if (seedParam) {
        document.getElementById("seed").value = seedParam;
    }

    if (floorParam) {
        document.getElementById("floor").value = floorParam;
    }

    if (roomsParam) {
        document.getElementById("roomCount").value = roomsParam;
    }

    if (seedParam) {
        generateRooms();
    }

    document.getElementById('seedMode').addEventListener('change', function() {
        const customStartGroup = document.getElementById('customStartGroup');
        if (this.value === 'custom') {
            customStartGroup.style.display = 'block';
        } else {
            customStartGroup.style.display = 'none';
        }
    });
});