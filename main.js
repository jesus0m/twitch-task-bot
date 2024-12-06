import { startTwitchBot } from './twitchClient.js'; // Cliente de Twitch
import { updateTasksAndRender } from './taskRenderer.js';

// Renderización inicial del estado vacío
updateTasksAndRender([], 'Nadie ha solicitado tareas');

// Inicia el cliente de Twitch y pasa la función de actualización
startTwitchBot(updateTasksAndRender);