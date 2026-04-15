const API_KEY = "AIzaSyCY6M1paBvfLehWAT5z1mbQdCjoNKMHaDw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Digite um tema!");

    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    btnDownload.style.display = 'none';
    barra.style.width = "0%";

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 2;
        if (progresso > 90) progresso = 90;
        barra.style.width = progresso + "%";
        statusTxt.innerText = "IA processando conteúdo...";
    }, 600);

    try {
        // ROTA V1 ESTÁVEL - A prova de falhas para chaves novas
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Gere um guia de estudo sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        // Se der erro, ele vai imprimir o objeto inteiro no console para eu ler
        if (data.error) {
            console.error("Erro detalhado:", data.error);
            throw new Error(data.error.message);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        clearInterval(intervalo);
        barra.style.width = "100%";
        statusTxt.innerText = "CONCLUÍDO!";
        btnDownload.style.display = 'block';
        
        btnDownload.onclick = () => {
            const blob = new Blob([textoGerado], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Guia_TucaStudy.txt`;
            a.click();
        };

    } catch (error) {
        clearInterval(intervalo);
        alert("ALERTA: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
