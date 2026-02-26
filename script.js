// --- 1. DATA CERITA (NASKAH) ---
// Kamu bisa mengganti URL gambar dengan nama file gambarmu (misal: 'bg1.png')
const storyData = {
    "start_narration": {
        type: "narration",
        text: "Di sebuah dunia yang jauh, petualanganmu dimulai...",
        next: "scene_1" // Lanjut ke scene_1 saat di-klik
    },
    "scene_1": {
        type: "dialog",
        bg: "https://via.placeholder.com/800x600/333333/ffffff?text=Background+Hutan", // Ganti dengan gambar BG-mu
        charLeft: "https://via.placeholder.com/300x500/ff9999/000000?text=Karakter+Kiri", // Ganti gambar
        charRight: "", // Kosongkan jika tidak ada karakter kanan di momen ini
        speaker: "Ksatria",
        text: "Berhenti di sana! Siapa kamu?",
        next: "scene_2"
    },
    "scene_2": {
        type: "choice", // Momen pilihan (Bercabang)
        bg: "https://via.placeholder.com/800x600/333333/ffffff?text=Background+Hutan",
        charLeft: "https://via.placeholder.com/300x500/ff9999/000000?text=Karakter+Kiri",
        charRight: "https://via.placeholder.com/300x500/9999ff/000000?text=Karakter+Kanan",
        speaker: "Ksatria",
        text: "Tentukan sikapmu sekarang!",
        choices: [
            { text: "Lari sekuat tenaga", target: "ending_lari" },
            { text: "Melawan ksatria itu", target: "ending_lawan" }
        ]
    },
    "ending_lari": {
        type: "narration",
        text: "Kamu berhasil melarikan diri. Cerita selesai.\n(Klik untuk kembali ke Menu Utama)",
        next: "main_menu" // Kembali ke main menu
    },
    "ending_lawan": {
        type: "narration",
        text: "Kamu bertarung dengan gagah berani, namun... Cerita selesai.\n(Klik untuk kembali ke Menu Utama)",
        next: "main_menu"
    }
};

// --- 2. VARIABEL GAME ---
let currentNodeId = "";

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

// --- 3. FUNGSI UTAMA ---

// Memulai Game
playBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    renderScene("start_narration"); // Ganti dengan ID adegan pertamamu
});

// Menampilkan Adegan
function renderScene(nodeId) {
    if (nodeId === "main_menu") {
        resetGame();
        return;
    }

    currentNodeId = nodeId;
    const sceneData = storyData[nodeId];

    // Sembunyikan semua layar dulu
    narrationScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    choicesBox.classList.add("hidden");
    dialogBox.classList.add("hidden");

    if (sceneData.type === "narration") {
        // Tampilkan layar hitam narasi
        narrationScreen.classList.remove("hidden");
        narrationText.innerText = sceneData.text;
    } 
    else if (sceneData.type === "dialog" || sceneData.type === "choice") {
        // Tampilkan layar visual novel
        gameScreen.classList.remove("hidden");
        dialogBox.classList.remove("hidden");
        
        // Atur Background
        bgImage.style.backgroundImage = `url('${sceneData.bg}')`;

        // Atur Karakter Kiri
        if (sceneData.charLeft) {
            charLeft.src = sceneData.charLeft;
            charLeft.classList.remove("hidden");
        } else {
            charLeft.classList.add("hidden");
        }

        // Atur Karakter Kanan
        if (sceneData.charRight) {
            charRight.src = sceneData.charRight;
            charRight.classList.remove("hidden");
        } else {
            charRight.classList.add("hidden");
        }

        // Atur Teks Dialog
        speakerName.innerText = sceneData.speaker;
        dialogText.innerText = sceneData.text;

        // Atur Pilihan (Jika ada)
        if (sceneData.type === "choice") {
            choicesBox.innerHTML = ""; // Bersihkan pilihan sebelumnya
            sceneData.choices.forEach(choice => {
                const btn = document.createElement("button");
                btn.className = "choice-btn";
                btn.innerText = choice.text;
                btn.onclick = (e) => {
                    e.stopPropagation(); // Mencegah klik tembus ke bawahnya
                    renderScene(choice.target);
                };
                choicesBox.appendChild(btn);
            });
            choicesBox.classList.remove("hidden");
        }
    }
}

// Fungsi untuk lanjut adegan saat diklik (Hanya berlaku kalau bukan mode pilihan)
function handleNextClick() {
    const sceneData = storyData[currentNodeId];
    if (sceneData && sceneData.type !== "choice") {
        renderScene(sceneData.next);
    }
}

// Tambahkan event listener untuk klik layar guna melanjutkan cerita
narrationScreen.addEventListener("click", handleNextClick);
dialogBox.addEventListener("click", handleNextClick);
bgImage.addEventListener("click", handleNextClick); // Klik background juga bisa lanjut

// Fungsi kembali ke Menu Utama
function resetGame() {
    narrationScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
}