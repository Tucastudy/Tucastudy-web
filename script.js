const API_KEY = "AIzaSyCSfkTGD1tVKCB6M9Mei_WMIG2cmWJtVQw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Por favor, digite um tema!");

    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    // Reset de Interface
    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    btnDownload.style.display = 'none';
    barra.style.width = "0%";
    statusTxt.innerText = "Iniciando motor Gemini Pro...";

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 1;
        if (progresso > 95) progresso = 95;
        barra.style.width = progresso + "%";
    }, 400);

    try {
        // Usando a rota que funcionou para você (Gemini Pro na v1)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Você é o tutor de elite do TucaStudy. Gere um guia de estudo profissional, organizado e detalhado sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const textoGerado = data.candidates[0].content.parts[0].text;

            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA CONCLUÍDO COM SUCESSO!";
            
            btnDownload.style.display = 'block';
            btnDownload.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `TucaStudy_${tema.replace(/ /g, "_")}.txt`;
                a.click();
            };
        } else {
            throw new Error("Resposta vazia do Google.");
        }

    } catch (error) {
        clearInterval(intervalo);
        alert("Erro ao gerar: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
  
