# Reproductor de Video con Comentarios en Tiempo Real

Este proyecto es un reproductor de video web que simula una transmisión en vivo con comentarios en tiempo real, similar a la interfaz de Twitch. Permite reproducir videos locales (.mp4) y mostrar comentarios sincronizados desde un archivo .srt.

## Características

- 🎥 Reproducción de videos .mp4
- 💬 Visualización de comentarios en tiempo real
- 🎨 Interfaz estilo streaming en vivo
- 📱 Diseño responsive
- ⚡ Sincronización automática de comentarios
- 🎮 Controles de video personalizados

## Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari)
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clona este repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm start
```

4. Abre tu navegador en `http://localhost:3000`

## Estructura del Proyecto

```
/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   ├── main.js         # Punto de entrada de la aplicación
│   ├── videoPlayer.js  # Lógica del reproductor de video
│   └── comments.js     # Manejo de comentarios
└── assets/
    └── fonts/          # Fuentes personalizadas
```

## Uso

1. Abre la aplicación en tu navegador
2. Haz clic en el botón "Seleccionar Video" para elegir tu archivo de video (.mp4)
3. Haz clic en el botón "Seleccionar Subtítulos" para elegir tu archivo de subtítulos (.srt)
4. ¡Disfruta de la reproducción con comentarios en tiempo real!

## Formato del Archivo .srt

El archivo .srt debe seguir el siguiente formato, donde los nicks de usuario deben comenzar y terminar con el símbolo `:`

```
1
00:00:01,000 --> 00:00:04,000
nickUsuario1: ¡Hola a todos!

2
00:00:05,000 --> 00:00:08,000
nickUsuario2: ¿Cómo están?
```

## Personalización

Puedes personalizar la apariencia modificando las variables CSS en `css/styles.css`:

```css
:root {
  --background-color: #18181b;
  --text-color: #efeff1;
  --accent-color: #9147ff;
}
```

## Desarrollo

### Comandos Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye la versión de producción
- `npm run test`: Ejecuta las pruebas
- `npm run lint`: Ejecuta el linter

### Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express (servidor de desarrollo)
