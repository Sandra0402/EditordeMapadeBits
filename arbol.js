/* ---------------- NIEVE REALISTA ---------------- */
const nieve = document.querySelector('.nieve');
for (let i = 0; i < 120; i++) {
    let copo = document.createElement("div");
    copo.classList.add("copo");
    copo.style.left = Math.random() * 100 + "%";
    copo.style.animationDelay = Math.random() * 5 + "s";
    copo.style.opacity = Math.random();
    nieve.appendChild(copo);
}

/* ---------------- REGALOS ---------------- */
function abrirRegalo(n) {
    const msg = document.getElementById("msg" + n);
    msg.style.display = "block";

    // Mostrar mensaje de FELIZ NAVIDAD también
    const mensajeNavidad = document.getElementById("mensajeNavidad");
    mensajeNavidad.style.display = "block";
}
