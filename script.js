// CONFIGURAÇÃO TUCASTUDY ALPHA
const API_KEY = "AIzaSyAz4XlKvrpocRQXC9rV0lnjaBWwPzV332o"; 

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) {
        alert("Por favor, digite um tema!");
        return;
    }

    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    
    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 1;
        if (progresso > 95) progresso = 95;
        barra.style.width = progresso + "%";
        
        if (progresso < 30) statusTxt.innerText = "IA mapeando conteúdo...";
        else if (progresso < 60) statusTxt.innerText = "Gerando guia de alta performance...";
        else statusTxt.innerText = "Finalizando formatação de elite...";
    }, 900); // Velocidade para completar em aprox. 90s

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo profissional e detalhado sobre: ${tema}. Use tópicos e linguagem clara.` }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const textoGerado = data.candidates[0].content.parts[0].text;

        // Espera o tempo de valorização do produto
        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA GERADO!";
            btnDownload.style.display = 'block';
            btnDownload.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const urlBlob = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = urlBlob;
                a.download = `TucaStudy_${tema}.txt`;
                a.click();
            };
        }, 85000);

    } catch (error) {
        clearInterval(intervalo);
        alert("Erro técnico. Verifique se sua chave API está correta e ativa.");
        console.error("Erro detalhado:", error);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
