let currentTasks = [];
let currentUser = '';
let rotationInterval;

export function renderTasks(tasks) {
  const container = document.getElementById('task-container');
  container.innerHTML = '';

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes glowWave {
      0% { box-shadow: 0 0 5px rgba(255, 170, 0, 0.3); border-color: rgba(255, 170, 0, 0.3); }
      50% { box-shadow: 0 0 10px rgba(255, 170, 0, 0.5); border-color: rgba(255, 170, 0, 0.5); }
      100% { box-shadow: 0 0 5px rgba(255, 170, 0, 0.3); border-color: rgba(255, 170, 0, 0.3); }
    }
  
    .glow-wave {
      animation: glowWave 3s infinite ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // 📌 Caja principal con Glassmorphism
  const taskBox = document.createElement('div');
  taskBox.classList.add(
    'rounded-3xl', 'shadow-lg', 'w-full', 'max-w-md', 'mx-auto',
    'overflow-hidden', 'backdrop-blur-lg', 'flex', 'flex-col', 'relative'
  );
  taskBox.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  taskBox.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
  taskBox.style.border = '1px solid rgba(255, 255, 255, 0.25)';
  taskBox.style.height = '650px';
  taskBox.style.paddingBottom = '0px';

  // 📌 Encabezado fijo
  const header = document.createElement('div');
  header.classList.add('relative', 'z-20', 'bg-white', 'pb-3', 'pt-4', 'shadow-md', 'flex', 'flex-col', 'items-center');
  header.style.position = 'sticky';
  header.style.top = '0';
  header.style.width = '100%';
  header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';

  const title = document.createElement('div');
  title.classList.add('text-lg', 'font-semibold', 'text-black', 'drop-shadow-lg');
  title.textContent = 'Tareas - !taskinfo';

  const userParagraph = document.createElement('span');
  userParagraph.classList.add(
    'px-3', 'py-1', 'bg-gray-700', 'text-md', 'rounded-full', 'text-white', 'mt-2', 'inline-block'
  );
  userParagraph.textContent = currentUser || "Nadie ha solicitado tareas";

  header.appendChild(title);
  header.appendChild(userParagraph);
  taskBox.appendChild(header);

  // 📌 Contenedor de tareas
  const taskListWrapper = document.createElement('div');
  taskListWrapper.style.flexGrow = '1';
  taskListWrapper.style.overflow = 'hidden';
  taskListWrapper.style.position = 'relative';
  taskListWrapper.style.display = 'flex';
  taskListWrapper.style.justifyContent = 'center';
  taskListWrapper.style.paddingBottom = '20px';

  const taskListContainer = document.createElement('div');
  taskListContainer.classList.add('space-y-5');
  taskListContainer.style.opacity = 0;
  taskListContainer.style.transition = 'opacity 1s ease-in-out';
  taskListContainer.style.width = '95%';
  taskListContainer.style.display = 'flex';
  taskListContainer.style.flexDirection = 'column';
  taskListContainer.style.alignItems = 'center';
  taskListContainer.style.marginTop = '10px';

  
  setTimeout(() => {
    taskListContainer.style.opacity = 1;
  }, 300);

  if (tasks.length === 0) {
    const noTasksMessage = document.createElement('div');
    noTasksMessage.classList.add('text-gray-500', 'text-center', 'mt-20', 'text-md');
    noTasksMessage.textContent =
      currentUser === "Nadie ha solicitado tareas"
        ? "No hay tareas disponibles."
        : `No hay tareas disponibles para ${currentUser || "este usuario"}.`;
    taskBox.appendChild(noTasksMessage);
  } else {
    tasks.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add(
        'p-4', 'rounded-2xl', 'shadow-md', 'w-full', 'flex',
        'items-center', 'justify-between', 'space-x-5', 'overflow-hidden'
      );
      
      // 📌 Mismo alto fijo para todas las tareas
      taskDiv.style.maxHeight = '47px'; // 🔹 Asegura que todas tengan el mismo tamaño      taskDiv.style.maxHeight = '50px'; // 🔹 Asegura que todas tengan el mismo tamaño
      taskDiv.style.minHeight = '47px'; // 🔹 Asegura que todas tengan el mismo tamaño
      taskDiv.style.display = 'flex';
      taskDiv.style.alignItems = 'center';

      taskDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      taskDiv.style.backdropFilter = 'blur(15px)';
      taskDiv.style.border = '2px solid rgba(255, 255, 255, 0.3)';
      taskDiv.style.boxShadow = '0px 5px 20px rgba(0, 0, 0, 0.2)';
      taskDiv.style.color = '#111';
      taskDiv.style.fontSize = '18px';
      taskDiv.style.padding = '20px';
      taskDiv.style.width = '100%';

      if (task.status.toLowerCase() === 'in progress') {
        taskDiv.classList.add('glow-wave');
      }

      // 📌 Indicador de estado
      const statusIndicator = document.createElement('span');
      statusIndicator.classList.add('h-5', 'w-5', 'rounded-full', 'flex-shrink-0');

      if (task.status.toLowerCase() === 'completed') {
        statusIndicator.style.background = 'linear-gradient(135deg, #2AF598, #009EFD)';
        statusIndicator.style.boxShadow = '0 0 15px rgba(50, 255, 100, 0.8)';
      } else if (task.status.toLowerCase() === 'in progress') {
        statusIndicator.style.background = 'linear-gradient(135deg, #FFC837, #FF8008)';
        statusIndicator.style.boxShadow = '0 0 15px rgba(255, 200, 0, 0.8)';
      } else {
        statusIndicator.style.background = 'linear-gradient(135deg, #B0BEC5, #78909C)';
        statusIndicator.style.boxShadow = '0 0 15px rgba(200, 200, 200, 0.6)';
      }

      // 📌 Texto de la tarea (con truncamiento automático)
      const taskTitle = document.createElement('span');
      taskTitle.textContent = task.title;
      taskTitle.classList.add('flex-grow', 'truncate', 'mr-2', 'text-lg', 'text-black');

      // 📌 ID visual de la tarea
      const idBubble = document.createElement('span');
      idBubble.textContent = task.id;
      idBubble.classList.add(
        'px-3', 'py-1', 'bg-gray-700', 'text-sm', 'rounded-full', 'font-mono', 'ml-2', 'text-white'
      );

      taskDiv.appendChild(statusIndicator);
      taskDiv.appendChild(taskTitle);
      taskDiv.appendChild(idBubble);
      taskListContainer.appendChild(taskDiv);
    });

    taskListWrapper.appendChild(taskListContainer);
    taskBox.appendChild(taskListWrapper);
  }

  container.appendChild(taskBox);
}

// Función para ordenar las tareas antes de mostrarlas
function sortTasks(tasks) {
  console.log(tasks)
  return tasks.sort((a, b) => {
    const order = { 'in progress': 1, 'pendiente': 2, 'completed': 3 };
    return (order[a.status.toLowerCase()] || 4) - (order[b.status.toLowerCase()] || 4);
  });
}

// Función para manejar la recepción de nuevas tareas y actualizar la vista
export function updateTasksAndRender(tasks, user) {
  currentUser = user || '';

  clearInterval(rotationInterval);

  if (tasks.length === 0) {
    renderTasks([]);
  } else {
    currentTasks = sortTasks(tasks);
    const size = 8;
    renderTasks(currentTasks.slice(0, size));

    if (currentTasks.length > size) {
      let startIndex = size;
      rotationInterval = setInterval(() => {
        if (startIndex >= currentTasks.length) {
          startIndex = 0;
        }
        renderTasks(currentTasks.slice(startIndex, startIndex + size));
        startIndex += size;
      }, 7000);
    }
  }
}