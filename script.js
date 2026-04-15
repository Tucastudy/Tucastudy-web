const API_KEY = "AIzaSyCSfkTGD1tVKCB6M9Mei_WMIG2cmWJtVQw";

async function iniciarProcessamento() {
    const temaInput = document.getElementById('tema');
    const tema = temaInput.value;
    
    if (!tema) {
        alert("Por favor, digite um tema!");
        return;
    }

    // Elementos da interface
    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    // Reset Visual
    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    btnDownload.style.display = 'none';
    barra.style.width = "0%";
    statusTxt.innerText = "Conectando ao TucaStudy...";

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 2;
        if (progresso > 90) progresso = 90;
        barra.style.width = progresso + "%";
    }, 400);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Gere um guia de estudo sobre: ${tema}` }] }],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const texto = data.candidates[0].content.parts[0].text;
            
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA GERADO!";
            btnDownload.style.display = 'block';
            
            btnDownload.onclick = () => {
                const blob = new Blob([texto], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `Estudo_${tema}.txt`;
                a.click();
            };
        } else {
            throw new Error("O Google bloqueou a resposta. Tente outro tema.");
        }

    } catch (error) {
        clearInterval(intervalo);
        alert("Erro: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
