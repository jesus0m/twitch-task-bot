# Twitch Task Manager Bot

<div align="center">
  <img width="411" alt="ssss" src="https://github.com/user-attachments/assets/cf360eb1-a79b-4734-b1a0-077aa6ef6986">
</div>

## Descripción

Twitch Task Manager Bot es una herramienta interactiva para gestionar tareas a través del chat de Twitch. Permite a los usuarios añadir, marcar, completar y eliminar tareas directamente desde el chat, mientras el progreso se muestra en un widget visual ideal para OBS.

---

## Características

- **Gestión de tareas personalizada**: Cada usuario tiene su lista privada de tareas.
- **Comandos simples**: Opciones para añadir, listar, actualizar y eliminar tareas.
- **Automarcado inteligente**: La primera tarea se marca automáticamente como "en curso".
- **Widget visual para OBS**: Muestra las tareas actuales en tiempo real.
- **Configuración sencilla**: Personalizable mediante un archivo `tmiConfig.js`.

---

## Instalación y Configuración

### **Guía de instalación**
1. **Descarga los archivos**:
   Descarga y extrae este proyecto en una carpeta local.

2. **Carga el widget en OBS**:
   - Abre OBS.
   - Añade una nueva fuente de tipo **"Navegador"**.
   - En la URL, selecciona el archivo `index.html` localmente (usando `file://`).
   - Ajusta el tamaño de la ventana según tus preferencias, por ejemplo, 800x600.
   - Haz clic en **Aceptar** para agregar el widget.

---

## Configuración del bot

1. **Edita el archivo `tmiConfig.js`**:
   Configura tu cuenta de Twitch y el canal donde se usará el bot:
   ```javascript
   export const tmiConfig = {
     username: "tu_nombre_de_usuario", // Nombre de usuario del bot de Twitch
     oauthToken: "oauth:tu_token",    // Token de autenticación de Twitch
     channels: ["nombre_del_canal"],  // Canales donde se activará el bot
   };
   ```
   Para obtener un token de autenticación, visita: [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/)

2. **Inicia el bot**:
   El bot se conecta automáticamente al canal configurado cuando cargas el archivo en OBS.

---

## Comandos Disponibles

| **Comando**          | **Descripción**                                                                                         |
|----------------------|---------------------------------------------------------------------------------------------------------|
| `!tareas` / `!tasks`                | Lista tus tareas pendientes y en curso.                                                  |
| `!add` / `!tarea` / `!task`         | Añade una nueva tarea con una descripción (por ejemplo: `!add Comprar café`).            |
| `!marcar` / `!check`                | Marca una tarea como "en curso" usando su ID o texto (por ejemplo: `!marcar 123`).       |
| `!hecho` / `!completar` / `!done`   | Marca una tarea como "completada" (por ejemplo: `!hecho 123`).                           |
| `!borrar` / `!delete`               | Elimina una tarea específica por su ID o texto (por ejemplo: `!delete 123`).             |
| `!taskclear`                        | Elimina todas las tareas de tu lista.                                                    |
| `!resetalltasks`                    | Elimina todas las tareas de todos los usuarios (solo disponible para moderadores).       |
| `!taskinfo`                         | Muestra una lista con todos los comandos disponibles.                                    |

---

## Personalización

- **Colores y diseño**: Puedes modificar los estilos del widget en el archivo `taskRenderer.js` o en los estilos CSS adjuntos.
- **Tamaños y transiciones**: Ajusta los tiempos de paginación o el tamaño máximo de tareas visibles en `taskRenderer.js`.

---

## Licencia

Este proyecto, **Twitch Task Manager Bot**, está licenciado bajo la [Licencia CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) con los siguientes términos:

- **Uso no comercial**: Puedes usar, modificar y compartir este proyecto, pero no para fines comerciales.
- **Atribución requerida**: Debes incluir el crédito al creador, **Jesus Oliva Morales**.
- **Compartir igual**: Si modificas o distribuyes el proyecto, debes usar la misma licencia.

Para usos comerciales o consultas adicionales, contacta con: [jesus241294@gmail.com](mailto:jesus241294@gmail.com).
