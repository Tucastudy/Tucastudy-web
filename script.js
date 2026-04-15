const API_KEY = "AIzaSyCY6M1paBvfLehWAT5z1mbQdCjoNKMHaDw";

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
        progresso += 1;
        if (progresso > 95) progresso = 95;
        barra.style.width = progresso + "%";
        statusTxt.innerText = "Conectando ao núcleo da IA...";
    }, 800);

    try {
        // Rota v1beta - A mais atualizada para chaves novas
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Você é um tutor de elite. Crie um guia de estudo completo, profissional e organizado sobre: ${tema}. Use tópicos e inclua dicas de memorização.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        // Simulando tempo de processamento para valorizar o produto (30 segundos)
        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA GERADO COM SUCESSO!";
            statusTxt.style.color = "#2ecc71";
            
            btnDownload.style.display = 'block';
            btnDownload.onclick = () => {
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
        alert("Ops! O Google retornou: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
