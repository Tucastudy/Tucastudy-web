const API_KEY = "AIzaSyAz4XlKvrpocRQXC9rV0lnjaBWwPzV332o"; 

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Por favor, digite um tema!");

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
        // Mudança para gemini-pro (v1), o modelo mais compatível do mundo
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo completo sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`[${data.error.code}] - ${data.error.message}`);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA CONCLUÍDO!";
            const btnDown = document.getElementById('btn-download');
            btnDown.style.display = 'block';
            btnDown.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `TucaStudy_${tema}.txt`;
                a.click();
            };
        }, 15000); // Reduzi para 15s para você testar logo se o erro sumiu!

    } catch (error) {
        clearInterval(intervalo);
        alert("INFO TÉCNICA: " + error.message);
        document.getElementById('btn-gerar').style.display = 'block';
        document.getElementById('area-progresso').style.display = 'none';
    }
}
