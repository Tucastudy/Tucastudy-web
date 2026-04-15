const API_KEY = "AIzaSyCY6M1paBvfLehWAT5z1mbQdCjoNKMHaDw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Digite um tema!");

    document.getElementById('btn-gerar').style.display = 'none';
    document.getElementById('area-progresso').style.display = 'block';
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');

    try {
        // ROTA 100% OFICIAL COM O MODELO MAIS ATUALIZADO
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo sobre: ${tema}` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`[${data.error.code}] - ${data.error.message}`);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        // Sucesso! Vamos finalizar a barra
        barra.style.width = "100%";
        statusTxt.innerText = "CONCLUÍDO!";
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
        alert("Ainda temos um detalhe: " + error.message);
        document.getElementById('btn-gerar').style.display = 'block';
        document.getElementById('area-progresso').style.display = 'none';
    }
}
