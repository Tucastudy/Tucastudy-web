const API_KEY = "AIzaSyCY6M1paBvfLehWAT5z1mbQdCjoNKMHaDw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Digite um tema!");

    document.getElementById('btn-gerar').style.display = 'none';
    document.getElementById('area-progresso').style.display = 'block';
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');

    try {
        // Tentando a rota 'v1' com o modelo PRO (que é mais difícil de dar erro 404)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se der erro 404 de novo, ele vai avisar aqui
            throw new Error(`[${data.error.code}] ${data.error.message}`);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        barra.style.width = "100%";
        statusTxt.innerText = "FINALMENTE!";
        const btnDown = document.getElementById('btn-download');
        btnDown.style.display = 'block';
        btnDown.onclick = () => {
            const blob = new Blob([textoGerado], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Guia_TucaStudy.txt`;
            a.click();
        };

    } catch (error) {
        alert("O Google insiste no erro: " + error.message);
        document.getElementById('btn-gerar').style.display = 'block';
        document.getElementById('area-progresso').style.display = 'none';
    }
}
