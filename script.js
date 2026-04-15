const API_KEY = "AIzaSyCSfkTGD1tVKCB6M9Mei_WMIG2cmWJtVQw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Por favor, digite um tema!");

    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    btnDownload.style.display = 'none';
    barra.style.width = "0%";
    statusTxt.innerText = "Sintonizando inteligência Pro...";

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 2;
        if (progresso > 90) progresso = 90;
        barra.style.width = progresso + "%";
    }, 300);

    try {
        // Rota estável v1 com Gemini Pro
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Escreva um guia de estudo curto sobre: ${tema}` }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048
                }
            })
        });

        const data = await response.json();

        // Verificação profunda da resposta
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            const textoGerado = data.candidates[0].content.parts[0].text;

            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "Tudo pronto! Seu guia foi gerado.";
            
            btnDownload.style.display = 'block';
            btnDownload.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `TucaStudy_Guia.txt`;
                a.click();
            };
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
             throw new Error("O Google bloqueou esse tema por segurança.");
        } else {
             console.log("Resposta completa do Google:", data);
             throw new Error("O servidor respondeu, mas não enviou o texto. Tente novamente.");
        }

    } catch (error) {
        clearInterval(intervalo);
        alert("Atenção: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
