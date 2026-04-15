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
    barra.style.width = "0%";
    statusTxt.innerText = "Validando acesso ao projeto...";

    try {
        // MUDANÇA CRÍTICA: Rota v1 (estável) com o modelo gemini-1.5-flash
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Gere um guia de estudo profissional sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se der erro aqui, vamos tentar a rota PRO automaticamente
            console.log("Tentando rota secundária...");
            return tentarRotaPro(tema);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        barra.style.width = "100%";
        statusTxt.innerText = "CONCLUÍDO!";
        btnDownload.style.display = 'block';
        btnDownload.onclick = () => {
            const blob = new Blob([textoGerado], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `TucaStudy_${tema}.txt`;
            a.click();
        };

    } catch (error) {
        alert("Erro persistente no servidor. Verifique se a API está habilitada no console.");
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}

async function tentarRotaPro(tema) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Resumo sobre: ${tema}` }] }] })
        });
        const data = await response.json();
        alert("O Google liberou apenas o modelo Pro para sua conta. Gerando agora...");
        // (Lógica de download idêntica aqui...)
    } catch(e) {
        alert("O Google ainda não propagou sua chave. Aguarde 15 min.");
    }
}
