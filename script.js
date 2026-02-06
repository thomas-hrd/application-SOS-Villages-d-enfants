const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const rewards = [
    "5 €",
    "2 €",
    "10 €",
    "1 €",
    "3 €",
    "6 €",
];

const colors = ["#b9defe", "#ff920a"];

let startAngle = 0;
let hasPlayed = false; // L'utilisateur n'a pas encore joué
let isSpinning = false;
const arc = (2 * Math.PI) / rewards.length;

/* 🔥 ICI on attend la police */
document.fonts.load("bold 30px Montserrat").then(() => {
    drawWheel();
});

function drawWheel() {
    for (let i = 0; i < rewards.length; i++) {
        const angle = startAngle + i * arc;

        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(170, 170);
        ctx.arc(170, 170, 160, angle, angle + arc);
        ctx.closePath();
        ctx.fill();

        ctx.save();

        // Couleur du texte
        ctx.fillStyle = "#003B7A";

        // Positionnement au centre de la roue
        ctx.translate(170, 170);

        // Rotation au milieu de la section
        ctx.rotate(angle + arc / 2);

        // Centrage parfait
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Texte plus gros et en gras
        ctx.font = "bold 30px Montserrat";

        // Placement au centre de la part
        ctx.fillText(rewards[i], 100, 0);

        ctx.restore();
    }
}

drawWheel();

function spinWheel() {

    // Si déjà joué → bloqué
    if (hasPlayed) {
        alert("Vous avez déjà fait tourner la roue. Merci pour votre participation !");
        return;
    }

    hasPlayed = true; // Une seule tentative autorisée

    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "La roue tourne...";

    let spinAngle = Math.random() * 2000 + 2000;
    let duration = 3200;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        const easeOut = 1 - Math.pow(1 - progress / duration, 3);
        const angle = spinAngle * easeOut;

        startAngle = (angle * Math.PI) / 180;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {

            const degrees = (startAngle * 180) / Math.PI + 90;
            const index = Math.floor(
                (360 - (degrees % 360)) / (360 / rewards.length)
            );

            const reward = rewards[index];

            const message =
                "Bravo ! " + reward +
                " pour vous et " + reward +
                " pour SOS Villages d’Enfants." +
                "<span class='message-info'>Votre bon d’achat est disponible sur l’application, dans l’onglet \"Mes avantages\" de la section \"Bons à activer\".</span>";
            // Affichage sous la roue
            resultDiv.innerHTML = message;

            // Affichage dans le pop-up
            setTimeout(() => {
                showPopup(message);
            }, 1150);

        }
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener("click", spinWheel);

function showPopup(message) {
    document.getElementById("popup-message").innerHTML = message;
    document.getElementById("popup").style.display = "flex";
}


function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function sharePage() {
    const shareData = {
        title: "Roue Solidaire – SOS Villages d’Enfants",
        text: "J’ai participé à une roue solidaire pour soutenir SOS Villages d’Enfants. Fais tourner la roue toi aussi !",
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback si le partage natif n’est pas disponible
        navigator.clipboard.writeText(window.location.href);
        alert("Lien copié ! Vous pouvez le partager avec vos proches.");
    }
}