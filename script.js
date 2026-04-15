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
        
        if (progresso < 30) statusTxt.innerText = "IA localizando servidores...";
        else if (progresso < 60) statusTxt.innerText = "Gerando conteúdo de elite...";
        else statusTxt.innerText = "Preparando seu arquivo...";
    }, 900);

    try {
        // ROTA DEFINITIVA: v1 (estável) com o nome técnico completo do modelo
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Gere um guia de estudo completo e detalhado para um estudante de elite sobre: ${tema}.` }] }]
            })
        });

        const data = await response.json();

        // Se der erro 404 ou qualquer outro, ele vai detalhar aqui
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
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `TucaStudy_${tema.replace(/ /g, "_")}.txt`;
                a.click();
            };
        }, 30000); 

    } catch (error) {
        clearInterval(intervalo);
        alert("INFO TÉCNICA: " + error.message);
        document.getElementById('btn-gerar').style.display = 'block';
        document.getElementById('area-progresso').style.display = 'none';
    }
}
