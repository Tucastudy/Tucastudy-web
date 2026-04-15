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
    statusTxt.innerText = "Forçando resposta do motor Gemini...";

    try {
        // Usando v1beta que aceita melhor as configurações de segurança manuais
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Explique detalhadamente como funciona: ${tema}` }] 
                }],
                // CONFIGURAÇÃO DE DESBLOQUEIO TOTAL
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
                ],
                generationConfig: {
                    temperature: 0.4, // Menor temperatura = resposta mais objetiva e menos chance de erro
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1500
                }
            })
        });

        const data = await response.json();

        // Checagem se o texto existe mesmo com filtros
        if (data.candidates && data.candidates[0].content) {
            const textoGerado = data.candidates[0].content.parts[0].text;

            barra.style.width = "100%";
            statusTxt.innerText = "SUCESSO! Guia disponível.";
            
            btnDownload.style.display = 'block';
            btnDownload.onclick = () => {
                const blob = new Blob([textoGerado], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `TucaStudy_${tema.replace(/ /g, "_")}.txt`;
                a.click();
            };
        } else {
            // Se o Google barrar, ele geralmente avisa o motivo técnico aqui
            const motivo = data.promptFeedback?.blockReason || "Filtro Automático";
            throw new Error(`O Google barrou o conteúdo por: ${motivo}. Tente um tema mais simples.`);
        }

    } catch (error) {
        alert("Erro técnico: " + error.message);
        btnGerar.style.display = 'block';
        areaProgresso.style.display = 'none';
    }
}
