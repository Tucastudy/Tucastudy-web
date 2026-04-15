const API_KEY = "AIzaSyCSfkTGD1tVKCB6M9Mei_WMIG2cmWJtVQw";

async function iniciarProcessamento() {
    const tema = document.getElementById('tema').value;
    if (!tema) return alert("Por favor, digite um tema!");

    const btnGerar = document.getElementById('btn-gerar');
    const areaProgresso = document.getElementById('area-progresso');
    const barra = document.getElementById('barra-progresso');
    const statusTxt = document.getElementById('status-texto');
    const btnDownload = document.getElementById('btn-download');

    btnGerar.style.display = 'none';
    areaProgresso.style.display = 'block';
    btnDownload.style.display = 'none';
    barra.style.width = "0%";
    statusTxt.innerText = "Gerando guia de alta performance...";

    let progresso = 0;
    let intervalo = setInterval(() => {
        progresso += 5;
        if (progresso > 95) progresso = 95;
        barra.style.width = progresso + "%";
    }, 300);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Aja como um professor especialista. Gere um guia de estudos detalhado e organizado em tópicos sobre: ${tema}` }] 
                }],
                // Desativa filtros que podem causar resposta vazia
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 1000
                }
            })
        });

        const data = await response.json();

        // Extração segura do texto
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const textoGerado = data.candidates[0].content.parts[0].text;

            clearInterval(intervalo);
            barra.style.width = "100%";
            statusTxt.innerText = "FINALIZADO COM SUCESSO!";
            
            btnDownload.style.display = 'block';
            btnDownload.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `Guia_Estudo_${tema.replace(/ /g, "_")}.txt`;
                a.click();
            };
        } else {
            throw new Error("O Google processou, mas a segurança barrou o texto. Tente outro tema.");
        }

    } catch (error) {
        clearInterval(intervalo);
        alert("Erro no motor Gemini: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
