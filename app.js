// Importación de las funciones y módulos necesarios desde @bot-whatsapp/bot
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');

// Importación del módulo QRPortalWeb para generar el código QR para la autenticación de WhatsApp Web
const QRPortalWeb = require('@bot-whatsapp/portal');

// Importación del proveedor Baileys para la conexión con WhatsApp Web
const BaileysProvider = require('@bot-whatsapp/provider/baileys');

// Importación del adaptador MockAdapter para el manejo de la base de datos en memoria
const MockAdapter = require('@bot-whatsapp/database/mock');

// Importación del las rutas para leer los archivos txt
const path = require('path');
const fs = require('fs');
// Importación del archivo de texto de la carpeta mensajes
const MenuPath = path.join(__dirname, 'mensajes', "menu.txt");
const menu = fs.readFileSync(MenuPath, 'utf8');

// Definición del flujo de bienvenida que responde automáticamente al inicio de la conversación
const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('👨🏻‍🚀 Bienvenido al Chatbot')
    .addAnswer('Escribe "Menu" para ver las opciones disponibles.');

// Flujo de menú principal
const menuFlow = addKeyword(['Menu']).addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallback, flowDynamic }) => {
        const option = ctx.body.trim();
        if (!['1', '2', '3', '4', '0'].includes(option)) {
            return fallback('Respuesta no válida, por favor selecciona una de las opciones.');
        }
        switch (option) {
            case '1':
                return await flowDynamic('Menu1');
            case '2':
                return await flowDynamic('Menu2');
            case '3':
                return await flowDynamic('Menu3');
            case '4':
                return await flowDynamic('Menu4');
            case '0':
                return await flowDynamic('Saliendo... Puedes volver a acceder a este menú escribiendo "Menu".');
        }
    }
);

// Flujo para Documentación
const Menu1 = addKeyword('Menu 1').addAnswer(
    [
        '📄 Aquí encontras la documentación. Recuerda que puedes mejorarla:',
        'https://bot-whatsapp.netlify.app/',
        'Escribe "Menu" para volver al menú principal.'
    ]
);

// Flujo para Tutoriales
const Menu2 = addKeyword('Menu 2').addAnswer(
    [
        '🙌 Aquí encuentras un ejemplo rápido:',
        'https://bot-whatsapp.netlify.app/docs/example/',
        'Escribe "Menu" para volver al menú principal.'
    ]
);

// Flujo para Agradecimientos
const Menu3 = addKeyword('Menu 3').addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto:',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        'Escribe "Menu" para volver al menú principal.'
    ]
);

// Flujo para Unirse a Discord
const Menu4 = addKeyword('Menu 4').addAnswer(
    [
        '🤪 Únete al Discord:',
        'https://link.codigoencasa.com/DISCORD',
        'Escribe "Menu" para volver al menú principal.'
    ]
);

// Función principal asíncrona que configura y arranca el bot
const main = async () => {
    try {
        // Inicialización del adaptador de base de datos en memoria
        const adapterDB = new MockAdapter();

        // Creación del flujo a partir de los flujos definidos
        const adapterFlow = createFlow([flowWelcome, menuFlow, Menu1, Menu2, Menu3, Menu4]);

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
