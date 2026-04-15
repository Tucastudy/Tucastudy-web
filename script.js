const API_KEY = "AIzaSyAz4XlKvrpocRQXC9rV0lnjaBWwPzV332o";

async function iniciarProcessamento() {
    const temaInput = document.getElementById('tema');
    const tema = temaInput.value;
    
    if (!tema) {
        alert("Por favor, digite um tema!");
        return;
    }

    // Elementos da tela
    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    // Reset de interface
    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    btnDownload.style.display = 'none';
    barra.style.width = "0%";
    statusTxt.innerText = "IA iniciando processamento...";

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 2;
        if (progresso > 90) progresso = 90;
        barra.style.width = progresso + "%";
    }, 500);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Gere um guia de estudo curto e objetivo sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        // Finalização rápida para teste
        clearInterval(intervalo);
        barra.style.width = "100%";
        statusTxt.innerText = "GUIA CONCLUÍDO!";
        
        btnDownload.style.display = 'block';
        btnDownload.onclick = () => {
            const blob = new Blob([textoGerado], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Guia_${tema}.txt`;
            a.click();
        };

    } catch (error) {
        clearInterval(intervalo);
        alert("Erro na IA: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
