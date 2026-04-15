const API_KEY = "AIzaSyAz4XlKvrpocRQXC9rV0lnjaBWwPzV332o"; 

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Digite um tema!");

    document.getElementById('btn-gerar').style.display = 'none';
    document.getElementById('area-progresso').style.display = 'block';
    
    let progresso = 0;
    let barra = document.getElementById('barra-progresso');
    let statusTxt = document.getElementById('status-texto');

    let intervalo = setInterval(() => {
        progresso += 1;
        if (progresso > 95) progresso = 95;
        barra.style.width = progresso + "%";
    }, 900);

    try {
        // Mudamos a URL para a versão mais estável v1beta
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo sobre ${tema}` }] }]
            })
        });

        const data = await response.json();

        // Se o Google mandou um erro, ele vai aparecer no alerta agora
        if (data.error) {
            throw new Error(`Código ${data.error.code}: ${data.error.message}`);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA GERADO!";
            const btnDown = document.getElementById('btn-download');
            btnDown.style.display = 'block';
            btnDown.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `TucaStudy_${tema}.txt`;
                a.click();
            };
        }, 30000); // Reduzi para 30s só para a gente testar rápido agora!

    } catch (error) {
        clearInterval(intervalo);
        // ISSO VAI TE MOSTRAR O ERRO REAL
        alert("ERRO REAL: " + error.message);
        document.getElementById('btn-gerar').style.display = 'block';
        document.getElementById('area-progresso').style.display = 'none';
    }
}
