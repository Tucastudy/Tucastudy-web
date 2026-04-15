const API_KEY = "AIzaSyAz4XlKvrpocRQXC9rV0lnjaBWwPzV332o";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Digite um tema!");

    document.getElementById('btn-gerar').style.display = 'none';
    document.getElementById('area-progresso').style.display = 'block';
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 1;
        if (progresso > 90) progresso = 90;
        barra.style.width = progresso + "%";
        statusTxt.innerText = "IA buscando melhor rota...";
    }, 500);

    // LISTA DE ROTAS PARA TESTAR (Fallback)
    const rotas = [
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
    ];

    let sucesso = false;
    let textoFinal = "";

    for (let url of rotas) {
        if (sucesso) break;
        try {
            statusTxt.innerText = "Conectando ao motor Gemini...";
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Gere um guia de estudo sobre: ${tema}` }] }]
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0].content) {
                textoFinal = data.candidates[0].content.parts[0].text;
                sucesso = true;
            }
        } catch (e) {
            console.log("Rota falhou, tentando próxima...");
        }
    }

    if (sucesso) {
        clearInterval(intervalo);
        barra.style.width = "100%";
        statusTxt.innerText = "GUIA GERADO COM SUCESSO!";
        btnDownload.style.display = 'block';
        btnDownload.onclick = () => {
            const blob = new Blob([textoFinal], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Guia_${tema}.txt`;
            a.click();
        };
    } else {
        clearInterval(intervalo);
        alert("ERRO: O Google não liberou sua chave para os modelos Flash ou Pro. Verifique o Google AI Studio.");
        document.getElementById('btn-gerar').style.display = 'block';
        document.getElementById('area-progresso').style.display = 'none';
    }
}
