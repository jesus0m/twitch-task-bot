let currentTasks = [];
let currentUser = ''; // Almacena el nombre del usuario que solicitó las tareas
let rotationInterval;

// Función para mostrar el conjunto de tareas en el widget
export function renderTasks(tasks) {
  const container = document.getElementById('task-container');
  container.innerHTML = ''; // Limpia el contenido previo

  // Crear el cajetín principal con el fondo negro semitransparente
  const taskBox = document.createElement('div');
  taskBox.classList.add('p-4', 'rounded-lg', 'shadow-md', 'w-full', 'max-w-md', 'mx-auto', 'space-y-3', 'overflow-hidden', 'backdrop-blur');
  taskBox.style.backgroundColor = 'rgba(0, 0, 0, 0.99)';
  taskBox.style.height = '650px'; // Altura fija
  taskBox.style.paddingBottom = '32px'; // Espacio extra en la parte inferior

  // Crear encabezado con título y nombre de usuario resaltado en burbuja
  const header = document.createElement('div');
  header.classList.add('mb-4', 'text-center');

  const title = document.createElement('div');
  title.classList.add('text-lg', 'font-semibold', 'text-white');
  title.textContent = 'Tareas - !taskinfo';

  const userParagraph = document.createElement('span');
  userParagraph.classList.add('px-3', 'py-1', 'bg-gray-700', 'text-md', 'rounded-full', 'text-white', 'mt-1', 'inline-block');
  userParagraph.textContent = currentUser || "Nadie ha solicitado tareas";

  header.appendChild(title);
  header.appendChild(userParagraph);
  taskBox.appendChild(header);

  // Condición para mostrar el mensaje "No hay tareas" si `tasks` está vacío
  if (tasks.length === 0) {
    const noTasksMessage = document.createElement('div');
    noTasksMessage.classList.add('text-gray-400', 'text-center', 'mt-20', 'text-sm');
    noTasksMessage.textContent =
      currentUser === "Nadie ha solicitado tareas"
        ? "No hay tareas disponibles."
        : `No hay tareas disponibles para ${currentUser || "este usuario"}.`;
    taskBox.appendChild(noTasksMessage);
  } else {
    // Crear un contenedor para las tareas si existen
    const taskListContainer = document.createElement('div');
    taskListContainer.classList.add('space-y-3');
    taskListContainer.style.opacity = 0;

    tasks.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('p-3', 'rounded', 'bg-gray-900', 'text-white', 'text-sm', 'flex', 'items-center', 'justify-between', 'space-x-3');

      // Indicador de estado
      const statusIndicator = document.createElement('span');
      statusIndicator.classList.add('flex-shrink-0', 'h-3', 'w-3', 'rounded-full');

      if (task.status === 'completed') {
        statusIndicator.classList.add('bg-green-500');
        taskDiv.style.border = '1px solid green';
      } else if (task.status === 'in progress') {
        statusIndicator.classList.add('bg-yellow-500');
        taskDiv.style.border = '1px solid orange';
      } else {
        statusIndicator.classList.add('bg-gray-500');
      }

      const title = document.createElement('span');
      title.textContent = task.title;
      title.classList.add('flex-grow', 'truncate', 'mr-2');
      if (task.status === 'completed') {
        title.classList.add('line-through', 'text-gray-400');
      } else if (task.status === 'in progress') {
        title.classList.add('text-orange-300');
      } else {
        title.classList.add('text-gray-200');
      }

      const idBubble = document.createElement('span');
      idBubble.textContent = task.id;
      idBubble.classList.add('px-2', 'py-1', 'bg-gray-700', 'text-xs', 'rounded-full', 'font-mono', 'ml-2', 'flex-shrink-0');

      taskDiv.appendChild(statusIndicator);
      taskDiv.appendChild(title);
      taskDiv.appendChild(idBubble);
      taskListContainer.appendChild(taskDiv);
    });

    taskBox.appendChild(taskListContainer);
    setTimeout(() => {
      taskListContainer.style.transition = 'opacity 1s ease-in-out';
      taskListContainer.style.opacity = 1;
    }, 100);
  }

  container.appendChild(taskBox);
}

// Función para ordenar las tareas antes de mostrarlas
function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    if (a.status === 'in progress' && b.status !== 'in progress') return -1;
    if (b.status === 'in progress' && a.status !== 'in progress') return 1;
    if (a.status === 'pendiente' && b.status === 'completed') return -1;
    if (b.status === 'pendiente' && a.status === 'completed') return 1;
    return 0;
  });
}

// Función para manejar la recepción de nuevas tareas y actualizar la vista
export function updateTasksAndRender(tasks, user) {
  currentUser = user || '';

  clearInterval(rotationInterval);

  if (tasks.length === 0) {
    renderTasks([]); // Renderiza sin tareas pero con el nombre de usuario actual
  } else {
    currentTasks = sortTasks(tasks); // Ordena las tareas
    const size = 9; // Mostrar 9 tareas por página
    renderTasks(currentTasks.slice(0, size)); // Renderiza las primeras 9 tareas

    if (currentTasks.length > size) {
      let startIndex = size;
      rotationInterval = setInterval(() => {
        if (startIndex >= currentTasks.length) {
          startIndex = 0;
        }
        renderTasks(currentTasks.slice(startIndex, startIndex + size));
        startIndex += size;
      }, 7000); // Cambia cada 7 segundos
    }
  }
}