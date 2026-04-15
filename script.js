const API_KEY = "AIzaSyCSfkTGD1tVKCB6M9Mei_WMIG2cmWJtVQw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Por favor, digite um tema!");

    // Interface
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
        statusTxt.innerText = "Conectando ao TucaStudy Project...";
    }, 600);

    try {
        // Rota oficial v1beta - agora com o projeto certo
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Você é o tutor do TucaStudy. Crie um guia de estudo completo, profissional e detalhado sobre: ${tema}.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`[${data.error.code}] - ${data.error.message}`);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        // Finalização
        clearInterval(intervalo);
        barra.style.width = "100%";
        statusTxt.innerText = "GUIA GERADO COM SUCESSO!";
        
        btnDownload.style.display = 'block';
        btnDownload.onclick = () => {
            const blob = new Blob([textoGerado], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TucaStudy_${tema.replace(/ /g, "_")}.txt`;
            a.click();
        };

    } catch (error) {
        clearInterval(intervalo);
        alert("Erro no TucaStudy: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
