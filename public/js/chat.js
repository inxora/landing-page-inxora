// chat.js - Versión para INXORA (v=48)

(function() {

    // Eliminar elementos antiguos
    const removeElements = () => {
        ["#chatbot-burbuja", "#chat-container", ".chat-container"].forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });
    };

    removeElements();

    // Cargar configuración
    const config = window.ChatWidgetConfig || {
        webhook: { url: '', route: '' },
        branding: {
            logo: '/logo_inxora/LOGO-03.png',
            name: 'INXORA',
            welcomeText: '¡Hola! Soy SARA XORA, tu asistente virtual. ¿En qué puedo ayudarte?',
            responseTimeText: ''
        },
        style: {
            primaryColor: '#13A0D8', // Color primario de INXORA
            secondaryColor: '#0d7ba8',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Variables globales
    let chatVisible = false;
    let currentSessionId = null;
    
    try {
        currentSessionId = crypto.randomUUID();
    } catch (e) {
        // Fallback para navegadores que no soportan crypto.randomUUID
        currentSessionId = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
    }

    // ========== [ESTILOS] ==========
    const styles = `
        #chatbot-burbuja {
            background: ${config.style.backgroundColor} !important;
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            cursor: pointer !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            border: 3px solid ${config.style.primaryColor} !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            animation: bubbleBounce 2.5s infinite ease-in-out !important;
        }

        #chatbot-burbuja:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.2) !important;
        }

        #chatbot-burbuja img {
            width: 36px !important;
            height: 36px !important;
            object-fit: contain !important;
        }
        
        #chatbot-burbuja.hidden {
            display: none !important;
        }

        #chat-container {
            position: fixed !important;
            bottom: 15px !important;
            right: 15px !important;
            width: 360px !important;
            height: 500px !important;
            max-height: 90vh !important;
            background: ${config.style.backgroundColor} !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
            z-index: 999998 !important;
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            border: 1px solid rgba(0,0,0,0.1) !important;
            display: none !important;
            flex-direction: column !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
        }

        #chat-container.open {
            display: flex !important;
            animation: chatFadeIn 0.3s forwards !important;
        }
        
        @keyframes chatFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bubbleBounce {
            0%, 100% { transform: translateY(0); }
            10% { transform: translateY(-7px); }
            20% { transform: translateY(0); }
            25% { transform: scale(1.1); }
            35% { transform: scale(1); }
            70% { box-shadow: 0 0 0 0 rgba(19, 160, 216, 0.4); }
            80% { box-shadow: 0 0 0 8px rgba(19, 160, 216, 0); }
        }
        
        .chat-header {
            position: sticky !important;
            top: 0 !important;
            background: white !important;
            z-index: 100 !important;
        }

        .brand-header {
            padding: 16px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            border-bottom: 1px solid rgba(0,0,0,0.1) !important;
            position: relative !important;
            background: linear-gradient(135deg, ${config.style.primaryColor}10, ${config.style.backgroundColor}) !important;
        }
        
        .chat-message.user {
            margin-left: auto !important;
            background: linear-gradient(135deg, ${config.style.primaryColor}, ${config.style.secondaryColor}) !important;
            color: white !important;
            border-radius: 18px 4px 18px 18px !important;
            width: fit-content !important;
            max-width: 80% !important;
            box-shadow: 0 2px 8px rgba(19, 160, 216, 0.15) !important;
            margin-bottom: 12px !important;
        }
        
        .chat-message.bot {
            background: #f8f8f8 !important;
            color: ${config.style.fontColor} !important;
            border-radius: 4px 18px 18px 18px !important; 
            border: 1px solid rgba(0,0,0,0.08) !important;
            margin-bottom: 12px !important;
            max-width: 85% !important;
        }
        
        .typing-indicator {
            color: #666 !important;
            font-style: italic !important;
            font-size: 14px !important;
            padding: 10px 16px !important;
            background: #f0f0f0 !important;
            border-radius: 4px 18px 18px 18px !important;
            margin-bottom: 12px !important;
            max-width: 85% !important;
            animation: pulse 1.5s infinite ease-in-out !important;
        }
        
        @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
        
        .chat-input textarea {
            border: 2px solid #e0e0e0 !important;
            border-radius: 12px !important;
            padding: 12px !important;
            font-size: 14px !important;
            transition: border 0.3s ease !important;
            resize: none !important;
            font-family: inherit !important;
        }
        
        .chat-input textarea:focus {
            outline: none !important;
            border: 2px solid ${config.style.primaryColor} !important;
            box-shadow: 0 0 0 2px ${config.style.primaryColor}20 !important;
        }

        .brand-header img {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            object-fit: contain !important;
        }

        .brand-header span {
            font-size: 18px !important;
            color: ${config.style.fontColor} !important;
            font-weight: 600 !important;
        }

        .close-chat-btn {
            background: rgba(0,0,0,0.05) !important;
            border: none !important;
            width: 30px !important;
            height: 30px !important;
            border-radius: 50% !important;
            position: absolute !important;
            right: 16px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            color: #333 !important;
            opacity: 0.7 !important;
            transition: all 0.2s !important;
        }

        .close-chat-btn:hover {
            background: rgba(0,0,0,0.1) !important;
            opacity: 1 !important;
        }

        .chat-messages {
            flex: 1 !important;
            padding: 20px !important;
            overflow-y: auto !important;
            overscroll-behavior: contain !important;
            background-color: ${config.style.backgroundColor} !important;
            display: flex !important;
            flex-direction: column !important;
        }

        .chat-message {
            padding: 12px 16px !important;
            margin: 4px 0 !important;
            border-radius: 12px !important;
            max-width: 80% !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            word-wrap: break-word !important;
        }

        .chat-input {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 12px 16px !important;
            border-top: 1px solid rgba(0,0,0,0.05) !important;
            background-color: ${config.style.backgroundColor} !important;
        }
        
        .chat-input textarea {
            flex: 1 !important;
            min-height: 42px !important;
            max-height: 120px !important;
            padding: 10px 14px !important;
            margin: 0 !important;
            border: 1px solid rgba(0,0,0,0.2) !important;
            border-radius: 8px !important;
            line-height: 1.4 !important;
        }
        
        .chat-input button {
            background: ${config.style.primaryColor} !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            transition: background-color 0.3s !important;
            font-weight: 500 !important;
        }
        
        .chat-input button:hover {
            background: ${config.style.secondaryColor} !important;
        }
        
        .send-btn {
            height: 42px !important;
            min-width: 80px !important;
            padding: 0 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            letter-spacing: 0.3px !important;
        }
        
        @keyframes messageAppear {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .chat-message {
            animation: messageAppear 0.3s ease-out forwards !important;
        }
        
        @media (max-width: 767px) {
            #chat-container {
                width: 95% !important;
                height: 70vh !important;
                bottom: 10px !important;
                right: 2.5% !important;
                border-radius: 12px !important;
            }
        
            .brand-header span {
                font-size: 16px !important;
            }
            
            .chat-input textarea {
                font-size: 16px !important;
            }
        
            .chat-messages {
                padding: 15px !important;
            }
            
            #chatbot-burbuja {
                bottom: 15px !important;
                right: 15px !important;
                width: 55px !important;
                height: 55px !important;
            }
            
            #chatbot-burbuja img {
                width: 32px !important;
                height: 32px !important;
            }
        }
    `;

    // Inyectar estilos
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ========== [HTML DEL CHAT] ==========
    // Burbuja
    const bubble = document.createElement("div");
    bubble.id = "chatbot-burbuja";
    const logoImg = document.createElement("img");
    logoImg.src = config.branding.logo || "/logo_inxora/LOGO-03.png";
    logoImg.alt = "SARA XORA - Asistente virtual de INXORA";
    bubble.appendChild(logoImg);
    document.body.appendChild(bubble);

    // Contenedor del chat
    const chatContainer = document.createElement("div");
    chatContainer.id = "chat-container";
    chatContainer.className = "chat-container";
    
    chatContainer.innerHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo || "/logo_inxora/LOGO-03.png"}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-chat-btn" aria-label="Cerrar chat">&times;</button>
        </div>
        <div class="chat-messages">
            <div class="chat-message bot">${config.branding.welcomeText}</div>
        </div>
        <div class="chat-input">
            <textarea placeholder="Escribe tu mensaje..." rows="1"></textarea>
            <button class="send-btn">Enviar</button>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // ========== [FUNCIONALIDAD] ==========
    const messagesContainer = chatContainer.querySelector(".chat-messages");
    const textarea = chatContainer.querySelector("textarea");
    const sendButton = chatContainer.querySelector(".send-btn");
    const closeButton = chatContainer.querySelector(".close-chat-btn");

    // Abrir chat
    function openChat() {
        chatContainer.classList.add("open");
        bubble.classList.add("hidden");
        chatVisible = true;
        
        setTimeout(() => {
            textarea.focus();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 300);
    }
    
    // Cerrar chat
    function closeChat() {
        chatContainer.classList.remove("open");
        bubble.classList.remove("hidden");
        chatVisible = false;
    }
    
    // Eventos
    bubble.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        openChat();
    }, true);
    
    closeButton.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeChat();
    }, true);

    // Auto-expandir textarea
    textarea.addEventListener("input", function() {
        this.style.height = "auto";
        const newHeight = Math.min(this.scrollHeight, 120);
        this.style.height = newHeight + "px";
    });

    // Enviar mensajes
    async function sendMessage(message) {
        if (!message) return;

        // Mensaje del usuario
        const userMessage = document.createElement("div");
        userMessage.className = "chat-message user";
        userMessage.textContent = message;
        messagesContainer.appendChild(userMessage);
        
        // Limpiar input
        textarea.value = "";
        textarea.style.height = "auto";
        
        // Scroll al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Indicador de escritura
        const typingIndicator = document.createElement("div");
        typingIndicator.className = "typing-indicator";
        typingIndicator.innerHTML = "SARA XORA está escribiendo...";
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Respuesta del bot
        try {
            console.log("📤 Enviando mensaje al webhook:", {
                url: config.webhook.url,
                body: {
                    action: "sendMessage",
                    sessionId: currentSessionId,
                    chatInput: message,
                    route: config.webhook.route
                }
            });

            const response = await fetch(config.webhook.url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept-Charset": "UTF-8"
                },
                body: JSON.stringify({
                    action: "sendMessage",
                    sessionId: currentSessionId,
                    chatInput: message,
                    route: config.webhook.route
                })
            });
            
            console.log("📥 Respuesta del servidor:", {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                ok: response.ok
            });
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Respuesta no exitosa:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            // Eliminar indicador de escritura
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            
            // Leer el texto completo antes de parsear
            const responseText = await response.text();
            console.log("📄 Respuesta en texto plano:", responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log("✅ JSON parseado correctamente:", data);
                console.log("🔍 Estructura de datos:", {
                    tipo: typeof data,
                    esArray: Array.isArray(data),
                    keys: data && typeof data === 'object' ? Object.keys(data) : 'N/A',
                    contenido: data
                });
            } catch (jsonError) {
                console.error("❌ Error al parsear JSON:", jsonError);
                console.error("📄 Texto que falló:", responseText);
                throw new Error("Error al procesar la respuesta del servidor");
            }
            
            const botMessage = document.createElement("div");
            botMessage.className = "chat-message bot";
            
            // Verificar diferentes estructuras de respuesta posibles
            let messageText = "Lo siento, no pude procesar tu solicitud.";
            
            // Intentar múltiples formas de extraer el mensaje
            if (data && data.output) {
                messageText = data.output;
                console.log("✅ Mensaje encontrado en data.output");
            } else if (data && Array.isArray(data) && data[0] && data[0].output) {
                messageText = data[0].output;
                console.log("✅ Mensaje encontrado en data[0].output");
            } else if (data && typeof data === 'string') {
                messageText = data;
                console.log("✅ Mensaje es string directo");
            } else if (data && data.message) {
                messageText = data.message;
                console.log("✅ Mensaje encontrado en data.message");
            } else if (data && data.text) {
                messageText = data.text;
                console.log("✅ Mensaje encontrado en data.text");
            } else if (data && data.response) {
                messageText = data.response;
                console.log("✅ Mensaje encontrado en data.response");
            } else {
                console.warn("⚠️ No se encontró mensaje en la estructura esperada. Data completo:", data);
            }
            
            console.log("💬 Mensaje final a mostrar:", messageText);
            botMessage.textContent = messageText;
            messagesContainer.appendChild(botMessage);

        } catch (error) {
            console.error("❌ Error completo:", error);
            console.error("❌ Stack trace:", error.stack);
            console.error("❌ Tipo de error:", error.name);
            console.error("❌ Mensaje de error:", error.message);
            
            // Eliminar indicador de escritura en caso de error
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            
            const errorMessage = document.createElement("div");
            errorMessage.className = "chat-message bot";
            
            // Detectar errores de CORS específicamente
            let errorText = "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente más tarde.";
            
            // Detectar errores de CORS
            const isCorsError = error.message && (
                error.message.includes("Failed to fetch") ||
                error.message.includes("CORS") ||
                error.message.includes("Access-Control")
            );
            
            // Si es un error de CORS o estamos en un dominio diferente al de producción
            if (isCorsError) {
                const currentOrigin = window.location.origin;
                const isProduction = currentOrigin === "https://www.inxora.com" || currentOrigin === "https://inxora.com";
                
                if (!isProduction) {
                    console.error("🚫 Error de CORS detectado. Estás en desarrollo local:", currentOrigin);
                    console.error("🚫 El servidor solo permite: https://inxora.com");
                    errorText = "⚠️ Error de CORS: Estás probando desde desarrollo local. El servidor solo permite solicitudes desde https://www.inxora.com. En producción funcionará correctamente.";
                } else {
                    console.error("🚫 Error de CORS en producción. Verifica la configuración del servidor.");
                    errorText = "Error de configuración: El servidor no permite solicitudes desde este dominio. Por favor, verifica la configuración de CORS en n8n.";
                }
            }
            
            errorMessage.textContent = errorText;
            messagesContainer.appendChild(errorMessage);
        }

        // Scroll hasta el final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Eventos
    sendButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
        }
    });
    
    textarea.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
            }
        }
    });
    
    // Prevenir propagación de clics dentro del chat
    chatContainer.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    
    // Evento para detectar clics fuera del chat (opcional)
    document.addEventListener("click", (e) => {
        if (chatVisible && !chatContainer.contains(e.target) && e.target !== bubble) {
            closeChat();
        }
    });
    
    // Debug
    console.log("Chat widget INXORA v48 inicializado correctamente");
    
    // Verificación de inicialización
    setTimeout(() => {
        if (!bubble.getAttribute('data-initialized')) {
            bubble.setAttribute('data-initialized', 'true');
            console.log("Re-inicializando eventos del bubble");
            bubble.onclick = openChat;
        }
    }, 1000);
})();

