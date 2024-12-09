import { tmiConfig } from './tmiConfig.js'; // Configuración del cliente
import { getUserTasks, addTask, updateTaskStatus, deleteTask, deleteAllTasks, deleteAllUsersTasks } from './taskController.js'; // Control de tareas

let updateTasksCallback = null; // Callback para actualizar el frontend del widget

export function startTwitchBot(updateCallback) {
  updateTasksCallback = updateCallback;

  const client = new tmi.Client({
    identity: {
      username: tmiConfig.username,
      password: tmiConfig.oauthToken,
    },
    channels: tmiConfig.channels,
  });

  client.connect()
    .then(() => {
      console.log(`✅ Bot conectado correctamente a los canales: ${tmiConfig.channels}`);
    })
    .catch(err => console.error('❌ Error al conectar el bot:', err));

  client.on('message', (channel, tags, message, self) => {
    if (self) return;

    const args = message.trim().split(' ');
    const command = args.shift().toLowerCase();
    const userId = tags.username;
    const isMod = tags.mod || (tags.badges && tags.badges.broadcaster);

    const translateStatus = (status) => {
      switch (status) {
        case 'in progress': return 'en curso';
        case 'completed': return 'completada';
        default: return 'pendiente';
      }
    };

    const findTask = (userTasks, searchText) => {
      const tasksById = userTasks.filter(task => task.id === searchText);
      const tasksByTitle = userTasks.filter(task => task.title.toLowerCase().includes(searchText.toLowerCase()));

      if (tasksById.length > 0) return tasksById[0];
      if (tasksByTitle.length === 1) return tasksByTitle[0];
      if (tasksByTitle.length > 1) return 'multiple';
      return null;
    };

    const updateTasks = (userId) => {
      if (updateTasksCallback) {
        const userTasks = getUserTasks(userId);
        updateTasksCallback(userTasks, userId);
      }
    };

    function splitAndSendMessages(channel, prefix, tasks, maxLength) {
      let message = prefix;
      tasks.forEach((taskText, index) => {
        const separator = index === tasks.length - 1 ? "" : " | ";
        if ((message + taskText + separator).length > maxLength) {
          client.say(channel, message.trim());
          message = prefix + taskText + separator;
        } else {
          message += taskText + separator;
        }
      });

      if (message.trim()) {
        client.say(channel, message.trim());
      }
    }

    switch (command) {
      case '!tareas':
      case '!tasks': {
        const tasks = getUserTasks(userId);
        const relevantTasks = tasks.filter(task => task.status !== 'completed');
        const taskList = relevantTasks.map(task => `[${task.id}] ${task.title} (${translateStatus(task.status)})`);

        if (taskList.length === 0) {
          client.say(channel, `📋 @${userId}, no tienes tareas pendientes. ¡Añade una con !tarea <descripción>!`);
        } else {
          splitAndSendMessages(channel, `📋 @${userId}, tus tareas: `, taskList, 255);
        }
        updateTasks(userId);
        break;
      }

      case '!tarea':
      case '!task':
      case '!add': {
        const description = args.join(' ');
        if (description.length > 255) {
          client.say(channel, `⚠️ @${userId}, la descripción de la tarea es demasiado larga. Usa menos de 255 caracteres.`);
          return;
        }

        if (!description) {
          client.say(channel, `⚠️ @${userId}, debes proporcionar una descripción para la tarea.`);
          return;
        }

        const userTasks = getUserTasks(userId);
        const hasInProgressTask = userTasks.some(task => task.status === 'in progress');

        // Si no hay tareas "en curso", marcamos esta como "in progress", de lo contrario "pendiente"
        const status = hasInProgressTask ? 'pendiente' : 'in progress';
        const newTask = addTask(userId, description, status);

        client.say(channel, `📝 @${userId}, tarea añadida: [${newTask.id}] ${newTask.title} (${translateStatus(newTask.status)})`);
        updateTasks(userId);

        // Comprobar y marcar automáticamente si todas están completadas
        const allTasksCompleted = userTasks.every(task => task.status === 'completed');
        if (allTasksCompleted) {
          updateTaskStatus(userId, newTask.id, 'in progress');
          client.say(channel, `✅ @${userId}, tarea [${newTask.id}] marcada automáticamente como "en curso".`);
          updateTasks(userId);
        }
        break;
      }

      case '!marcar':
      case '!check': {
        const taskIdOrText = args.join(' ');
        if (taskIdOrText.length > 255) {
          client.say(channel, `⚠️ @${userId}, el ID o texto de la tarea es demasiado largo.`);
          return;
        }

        const userTasks = getUserTasks(userId);
        const task = findTask(userTasks, taskIdOrText);

        if (task === 'multiple') {
          client.say(channel, `⚠️ @${userId}, hay varias tareas con ese nombre. Usa el ID exacto.`);
        } else if (task) {
          if (task.status === 'in progress') {
            client.say(channel, `⚠️ @${userId}, la tarea "${task.title}" ya está en curso.`);
          } else {
            updateTaskStatus(userId, task.id, 'in progress');
            client.say(channel, `✅ @${userId}, tarea [${task.id}] marcada como "en curso".`);
            updateTasks(userId);
          }
        } else {
          client.say(channel, `⚠️ @${userId}, tarea no encontrada.`);
        }
        break;
      }

      case '!hecho':
      case '!done':
      case '!completar': {
        const taskIdOrText = args.join(' ');
        if (taskIdOrText.length > 255) {
          client.say(channel, `⚠️ @${userId}, el ID o texto de la tarea es demasiado largo.`);
          return;
        }

        const userTasks = getUserTasks(userId);
        const task = findTask(userTasks, taskIdOrText);

        if (task === 'multiple') {
          client.say(channel, `⚠️ @${userId}, hay varias tareas con ese nombre. Usa el ID exacto.`);
        } else if (task) {
          if (task.status === 'completed') {
            client.say(channel, `⚠️ @${userId}, la tarea "${task.title}" ya está completada.`);
          } else {
            updateTaskStatus(userId, task.id, 'completed');
            client.say(channel, `✅ @${userId}, tarea [${task.id}] marcada como "completada".`);
            updateTasks(userId);
          }
        } else {
          client.say(channel, `⚠️ @${userId}, tarea no encontrada.`);
        }
        break;
      }

      case '!borrar':
      case '!delete': {
        const taskIdOrText = args.join(' ');
        if (taskIdOrText.length > 255) {
          client.say(channel, `⚠️ @${userId}, el ID o texto de la tarea es demasiado largo.`);
          return;
        }

        const userTasks = getUserTasks(userId);
        const task = findTask(userTasks, taskIdOrText);

        if (task === 'multiple') {
          client.say(channel, `⚠️ @${userId}, hay varias tareas con ese nombre. Usa el ID exacto.`);
        } else if (task) {
          const success = deleteTask(userId, task.id);
          if (success) {
            client.say(channel, `🗑️ @${userId}, tarea eliminada.`);
            updateTasks(userId);
          } else {
            client.say(channel, `⚠️ @${userId}, tarea no encontrada.`);
          }
        }
        break;
      }

      case '!taskclear': {
        deleteAllTasks(userId);
        client.say(channel, `🗑️ @${userId}, todas tus tareas han sido eliminadas.`);
        updateTasks(userId);
        break;
      }

      case '!resetalltasks': {
        if (isMod) {
          deleteAllUsersTasks();
          client.say(channel, `🗑️ Todas las tareas de todos los usuarios han sido eliminadas.`);
          updateTasks(null);
        } else {
          client.say(channel, `⚠️ @${userId}, no tienes permiso para usar este comando.`);
        }
        break;
      }

      case '!taskinfo': {
        client.say(channel, "ℹ️ Comandos de tareas disponibles:");
        client.say(channel, "!tareas / !tasks: Muestra tus tareas pendientes y en curso.");
        client.say(channel, "!add / !task / !tarea <descripción>: Añade una nueva tarea.");
        client.say(channel, "!marcar / !check <id o texto>: Marca una tarea como en curso.");
        client.say(channel, "!hecho / !completar / !done <id o texto>: Marca una tarea como completada.");
        client.say(channel, "!borrar / !delete <id o texto>: Elimina una tarea.");
        client.say(channel, "!taskclear: Elimina todas tus tareas.");
        client.say(channel, "!resetalltasks: Elimina todas las tareas. (Solo moderadores)");
        break;
      }

      default:
        console.log(`⚠️ Comando no reconocido: ${command}`);
        break;
    }
  });
}