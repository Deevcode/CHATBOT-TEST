// Importación de las funciones y módulos necesarios desde @bot-whatsapp/bot
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');

// Importación del módulo QRPortalWeb para generar el código QR para la autenticación de WhatsApp Web
const QRPortalWeb = require('@bot-whatsapp/portal');

// Importación del proveedor Baileys para la conexión con WhatsApp Web
const BaileysProvider = require('@bot-whatsapp/provider/baileys');

// Importación del adaptador MockAdapter para el manejo de la base de datos en memoria
const MockAdapter = require('@bot-whatsapp/database/mock');

// Definición del flujo secundario que responde a las palabras clave '2' y 'siguiente'
const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario']);

// Definición del flujo para documentación, que responde a las palabras clave 'doc', 'documentacion', y 'documentación'
const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
);

// Definición del flujo para tutoriales, que responde a las palabras clave 'tutorial' y 'tuto'
const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
);

// Definición del flujo para agradecimientos, que responde a las palabras clave 'gracias' y 'grac'
const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
);

// Definición del flujo para unirse a Discord, que responde a la palabra clave 'discord'
const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
);

// Definición del flujo principal, que responde a las palabras clave 'hola', 'ole', y 'alo'
const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    );

// Función principal asíncrona que configura y arranca el bot
const main = async () => {
    try {
        // Inicialización del adaptador de base de datos en memoria
        const adapterDB = new MockAdapter();

        // Creación del flujo a partir del flujo principal
        const adapterFlow = createFlow([flowPrincipal]);

        // Inicialización del proveedor Baileys para conectar con WhatsApp Web
        const adapterProvider = createProvider(BaileysProvider);

        // Creación del bot con el flujo, proveedor y base de datos configurados
        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });

        // Inicio del portal web para mostrar el código QR en el puerto 3001
        console.log('Iniciando QRPortalWeb en el puerto 3001...');
        QRPortalWeb({ port: 3001 });  // Cambia el puerto aquí si es necesario
        console.log('QRPortalWeb iniciado correctamente en el puerto 3001.');
    } catch (error) {
        // Manejo de errores durante la inicialización
        console.error('Error durante la inicialización:', error);
    }
};

// Ejecución de la función principal
main().catch(error => {
    // Manejo de errores durante la ejecución de la función principal
    console.error('Error iniciando el bot:', error);
});
