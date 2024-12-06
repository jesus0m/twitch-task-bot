// Inicializa 'tasks' como un objeto vacío o carga desde localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

// Guardar tareas en localStorage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Generar un identificador único de 3 caracteres para las tareas
const generateUniqueId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id;
  do {
    id = Array.from({ length: 3 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  } while (Object.values(tasks).some(userTasks => userTasks.some(task => task.id === id)));
  return id;
};

// Obtener las tareas de un usuario específico
export const getUserTasks = (userId) => {
  return tasks[userId] || [];
};

// Añadir una nueva tarea para un usuario
export const addTask = (userId, title, status) => {
  const newTask = { id: generateUniqueId(), title, status, userId };

  if (!tasks[userId]) {
    tasks[userId] = [];
  }

  tasks[userId].push(newTask);
  saveTasks();
  return newTask;
};

// Actualizar el estado de una tarea si pertenece al usuario
export const updateTaskStatus = (userId, taskId, status) => {
  if (!tasks[userId]) return false;

  const task = tasks[userId].find(t => t.id === taskId);
  if (task) {
    task.status = status;
    saveTasks();
    return true;
  }
  return false;
};

// Eliminar todas las tareas de un usuario específico
export const deleteAllTasks = (userId) => {
  if (tasks[userId]) {
    delete tasks[userId];
    saveTasks();
  }
};

// Eliminar una tarea específica de un usuario
export const deleteTask = (userId, taskId) => {
  if (!tasks[userId]) return false;

  const initialLength = tasks[userId].length;
  tasks[userId] = tasks[userId].filter(task => task.id !== taskId);

  if (tasks[userId].length !== initialLength) {
    saveTasks();
    return true;
  }

  return false;
};

// Eliminar todas las tareas de todos los usuarios
export const deleteAllUsersTasks = () => {
  tasks = {}; // Reinicia el objeto de tareas a vacío
  saveTasks();
};