// CONFIGURAÇÃO DO TUCASTUDY
const API_KEY = "AIzaSyDY1V9hOSz1iODegc09inz32CIw1ovIYiU"; // <--- Coloque sua chave entre as aspas

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) {
        alert("Por favor, digite um tema para o estudo!");
        return;
    }

    // Visual: Esconde botão e mostra barra
    document.getElementById('btn-gerar').style.display = 'none';
    document.getElementById('area-progresso').style.display = 'block';
    
    let progresso = 0;
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');

    // Simulação de tempo (90 segundos para valorizar o guia)
    let intervalo = setInterval(() => {
        progresso += 1.1; // Para chegar em 100% perto dos 90s
        if (progresso > 100) progresso = 100;
        barra.style.width = progresso + "%";

        if (progresso < 33) statusTxt.innerText = "IA analisando o tema: " + tema;
        else if (progresso < 66) statusTxt.innerText = "Gerando tópicos de memorização...";
        else if (progresso < 95) statusTxt.innerText = "Formatando guia de alta performance...";
    }, 1000);

    // CHAMADA DA IA REAL
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Crie um guia de estudo de elite sobre: ${tema}. Use tópicos, seja direto e inclua um resumo final.` }] }]
            })
        });

        const data = await response.json();
        const textoGerado = data.candidates[0].content.parts[0].text;

        // Quando o tempo acabar e a IA responder
        setTimeout(() => {
            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "GUIA GERADO COM SUCESSO!";
            statusTxt.style.color = "#33ccff";
            
            // Ativa o botão de download e guarda o texto nele
            const btnDown = document.getElementById('btn-download');
            btnDown.style.display = 'block';
            btnDown.onclick = () => baixarGuia(tema, textoGerado);
        }, 90000); // 90 segundos de "trava"

    } catch (error) {
        alert("Erro na conexão com a IA. Verifique sua chave!");
        console.error(error);
    }
}

function baixarGuia(titulo, conteudo) {
    const elemento = document.createElement('a');
    const arquivo = new Blob([conteudo], {type: 'text/plain'});
    elemento.href = URL.createObjectURL(arquivo);
    elemento.download = `Guia_TucaStudy_${titulo}.txt`;
    document.body.appendChild(elemento);
    elemento.click();
}
