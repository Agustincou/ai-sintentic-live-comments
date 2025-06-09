---
trigger: always_on
---

## 1. Definición del Proyecto
- Tipo: Aplicación Web Frontend
- Tecnologías principales: HTML5, JavaScript (ES6+)
- Alcance: Reproductor de video con sistema de comentarios en tiempo real
- Funcionalidades básicas:
  * Reproducción de video local
  * Sistema de comentarios en tiempo real
  * Interfaz tipo streaming

## 2. Requisitos Técnicos
- Navegadores soportados: Chrome, Firefox, Safari (últimas 2 versiones)
- Dependencias principales:
  * HTML5 Video API
  * JavaScript nativo (sin frameworks)
  * CSS3 para estilos
- Compatibilidad: Desktop y móvil

## 3. Estructura del Proyecto
- Organización de archivos:
  ```
  /
  ├── index.html
  ├── css/
  │   └── styles.css
  ├── js/
  │   ├── main.js
  │   ├── videoPlayer.js
  │   └── comments.js
  └── assets/
      └── fonts/
  ```
- Patrones de diseño: MVC (Modelo-Vista-Controlador)
- Convenciones: camelCase para JavaScript, kebab-case para archivos

## 4. Funcionalidades Principales
- Reproductor de video:
  * Control de reproducción (play/pause)
  * Barra de progreso
  * Control de volumen
  * Pantalla completa
- Sistema de comentarios:
  * Lectura de archivo .srt
  * Sincronización con tiempo de video
  * Animación de entrada de comentarios
  * Scroll automático
- Interacciones:
  * Eventos de video sincronizados con comentarios
  * Sistema de cola para comentarios
  * Manejo de errores de carga

## 5. Interfaz de Usuario
- Layout:
  * Video a la izquierda (70% del ancho)
  * Columna de comentarios a la derecha (30% del ancho)
  * Diseño responsive que se adapta a móvil
- Estética:
  * Tema oscuro similar a Twitch
  * Fuentes: Inter o Roboto
  * Paleta de colores:
    - Fondo: #18181b
    - Texto: #efeff1
    - Acentos: #9147ff
- Componentes:
  * Reproductor de video personalizado
  * Burbujas de comentarios
  * Indicadores de tiempo
  * Controles de video

## 6. Manejo de Datos
- Formato de archivos:
  * Video: .mp4 (H.264)
  * Subtítulos: .srt
- Estructura de datos:
  * Comentarios: {timestamp, username, message}
  * Configuración: {videoPath, srtPath, options}
- Validaciones:
  * Verificación de archivos
  * Formato de tiempo correcto
  * Codificación UTF-8

## 7. Rendimiento y Optimización
- Tiempos de carga:
  * Carga inicial < 2 segundos
  * Transición de comentarios < 100ms
- Optimizaciones:
  * Lazy loading de comentarios
  * Debounce en scroll
  * Caché de archivos .srt
- Recursos:
  * Compresión de assets
  * Minificación de código
  * Optimización de imágenes

## 8. Seguridad
- Validaciones:
  * Sanitización de input
  * Verificación de tipos de archivo
  * Límites de tamaño
- Consideraciones:
  * No almacenamiento de datos sensibles
  * Validación de rutas de archivo
  * Manejo de errores de carga

## 9. Documentación
- Nivel requerido:
  * Comentarios en código
  * README.md con instrucciones
  * Guía de uso
- Documentación técnica:
  * Estructura del proyecto
  * API de componentes
  * Flujo de datos

## 10. Testing
- Tipos de pruebas:
  * Unitarias para funciones principales
  * Integración para sincronización
  * UI para responsividad
- Cobertura:
  * Funciones core: 80%
  * UI: 100%
- Casos críticos:
  * Carga de archivos
  * Sincronización video-comentarios
  * Responsive design

---

# Ejemplo de Implementación
Para este proyecto específico:
- Tecnologías: HTML + JavaScript
- Funcionalidad: Reproductor de video con comentarios en tiempo real
- Características:
  * Reproducción de archivos .mp4
  * Lectura de archivos .srt
  * Interfaz estilo streaming en vivo (similar a Twitch)
  * Visualización de comentarios en tiempo real
  * Diseño responsive y moderno

Quiero un proyecto realizado en HTML + Javascript, simple pero funcional, que logre de manera local levantar un video .mp4 y un archivo .srt con comentarios simulados sintéticos que quiero que se muestren en una interfaz estilo streaming en vivo, con estética similar a las transmisiones en vivo en Twitch.

El archivo .srt contendrá comentarios ficticios de usuarios del live stream, que quiero que se vayan mostrando en una columna a la derecha del video, por sobre el video.