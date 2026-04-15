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
        
        if (progresso < 30) statusTxt.innerText = "IA conectando aos servidores...";
        else if (progresso < 60) statusTxt.innerText = "Gerando conteúdo de elite...";
        else statusTxt.innerText = "Formatando guia para download...";
    }, 900);

    try {
        // AJUSTE DE OURO: Usando 'gemini-1.5-flash' na rota v1beta1 que é a mais compatível
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo completo e detalhado sobre: ${tema}. Use tópicos e uma linguagem profissional.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se der erro de novo, vamos tentar a rota alternativa automaticamente
            throw new Error(`Código ${data.error.code}: ${data.error.message}`);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA GERADO COM SUCESSO!";
            
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
        alert("TENTANDO ROTA ALTERNATIVA...");
        // TENTATIVA 2: ROTA V1BETA COM NOME LONGO
        tentarRotaAlternativa(tema);
    }
}

async function tentarRotaAlternativa(tema) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo sobre: ${tema}` }] }]
            })
        });
        const data = await response.json();
        if (data.candidates) {
            alert("ROTA 2 FUNCIONOU! AGUARDE A BARRA.");
            // Lógica de download aqui também...
        } else {
            alert("ERRO FINAL: " + JSON.stringify(data.error));
        }
    } catch (e) {
        alert("ERRO CRÍTICO NA REDE.");
    }
}
