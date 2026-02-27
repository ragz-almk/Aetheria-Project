// --- 1. VARIABEL GAME ---
let currentStoryData = {}; // Sekarang datanya kosong di awal
let currentNodeId = "";
let typingInterval;
let isTyping = false;
let currentFullText = "";

// Ambil elemen dari HTML
const mainMenu = document.getElementById("main-menu");
const playBtn = document.getElementById("play-btn");
const narrationScreen = document.getElementById("narration-screen");
const narrationText = document.getElementById("narration-text");
const gameScreen = document.getElementById("game-screen");
const bgImage = document.getElementById("bg-image");
const charLeft = document.getElementById("char-left");
const charRight = document.getElementById("char-right");
const dialogBox = document.getElementById("dialog-box");
const speakerName = document.getElementById("speaker-name");
const dialogText = document.getElementById("dialog-text");
const choicesBox = document.getElementById("choices-box");

// --- 2. FUNGSI MEMUAT CHAPTER (JSON) ---
// Ini adalah sistem baru untuk mengambil file .json
async function loadChapter(fileName, startNodeId) {
    try {
        // Minta file ke server / local
        const response = await fetch(fileName);
        
        // Ubah teks file menjadi objek JavaScript
        currentStoryData = await response.json(); 
        
        // Jalankan adegan pertama di chapter tersebut
        renderScene(startNodeId);
    } catch (error) {
        console.error("Gagal memuat chapter:", error);
        alert("Terjadi kesalahan saat memuat cerita!");
    }
}

// --- 3. FUNGSI UTAMA ---

// Memulai Game (Load chapter pertama)
playBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    // Panggil file prolog.json, mulai dari "start_narration"
    loadChapter("story/prolog.json", "start_narration"); 
});

// Menampilkan Adegan
function renderScene(nodeId) {
    if (nodeId === "main_menu") {
        resetGame();
        return;
    }

    currentNodeId = nodeId;
    const sceneData = currentStoryData[nodeId];

    if (!sceneData) {
        console.error("Adegan tidak ditemukan:", nodeId);
        return;
    }

    // Sembunyikan semua layar dulu
    narrationScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    choicesBox.classList.add("hidden");
    dialogBox.classList.add("hidden");

    if (sceneData.type === "narration") {
        narrationScreen.classList.remove("hidden");
        narrationText.innerText = sceneData.text;
    } 
    else if (sceneData.type === "dialog" || sceneData.type === "choice") {
        gameScreen.classList.remove("hidden");
        dialogBox.classList.remove("hidden");
        
        if(sceneData.bg) bgImage.style.backgroundImage = `url('${sceneData.bg}')`;

        if (sceneData.charLeft) {
            charLeft.src = sceneData.charLeft;
            charLeft.classList.remove("hidden");
        } else { charLeft.classList.add("hidden"); }

        if (sceneData.charRight) {
            charRight.src = sceneData.charRight;
            charRight.classList.remove("hidden");
        } else { charRight.classList.add("hidden"); }

        speakerName.innerText = sceneData.speaker || "";
        
        // --- SISTEM EFEK MENGETIK BARU ---
        clearInterval(typingInterval); // Hentikan ketikan sebelumnya jika ada
        dialogText.innerHTML = "";     // Kosongkan kotak teks
        currentFullText = sceneData.text;
        isTyping = true;
        
        let charIndex = 0;
        typingInterval = setInterval(() => {
            if (charIndex < currentFullText.length) {
                dialogText.innerText += currentFullText.charAt(charIndex);
                charIndex++;
            } else {
                // Ketikan selesai
                clearInterval(typingInterval);
                isTyping = false;
            }
        }, 30); // Angka 30 adalah kecepatan (ms). Semakin kecil = semakin cepat.
        // ---------------------------------

        // Tampilkan Pilihan
        if (sceneData.type === "choice") {
            choicesBox.innerHTML = "";
            sceneData.choices.forEach(choice => {
                const btn = document.createElement("button");
                btn.className = "choice-btn";
                btn.innerText = choice.text;
                
                btn.onclick = (e) => {
                    e.stopPropagation();
                    // CEK: Apakah pilihan ini pindah chapter (file json lain)?
                    if (choice.target_file) {
                        loadChapter(choice.target_file, choice.target);
                    } else {
                        renderScene(choice.target);
                    }
                };
                choicesBox.appendChild(btn);
            });
            choicesBox.classList.remove("hidden");
        }
    }
}

// Lanjut adegan saat diklik
function handleNextClick() {
    // 1. Jika masih mengetik, klik berfungsi untuk langsung memunculkan semua teks
    if (isTyping) {
        clearInterval(typingInterval);
        dialogText.innerHTML = currentFullText;
        isTyping = false;
        return; // Hentikan fungsi di sini agar tidak pindah adegan
    }

    // 2. Jika sudah selesai mengetik, klik berfungsi untuk pindah adegan
    const sceneData = currentStoryData[currentNodeId];
    if (sceneData && sceneData.type !== "choice") {
        if (sceneData.target_file) {
            loadChapter(sceneData.target_file, sceneData.next);
        } else {
            renderScene(sceneData.next);
        }
    }
}

narrationScreen.addEventListener("click", handleNextClick);
dialogBox.addEventListener("click", handleNextClick);
bgImage.addEventListener("click", handleNextClick);

function resetGame() {
    narrationScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
}




