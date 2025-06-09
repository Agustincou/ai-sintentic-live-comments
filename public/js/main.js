document.addEventListener("DOMContentLoaded", () => {
  // Inicializar el reproductor de video
  const videoPlayer = new VideoPlayer();
  const fileSelectorMenu = document.getElementById("fileSelectorMenu");
  const showFileMenuBtn = document.getElementById("showFileMenuBtn");

  // Inicializar el gestor de comentarios
  const commentsManager = new CommentsManager(videoPlayer);

  // Simulación de incremento de subscriptores
  let subs = 2213;
  const subsGoal = 3000;
  const subsCount = document.getElementById("subsCount");
  const subsBarFill = document.getElementById("subsBarFill");
  function updateSubsBar() {
    subsCount.textContent = `${subs} / ${subsGoal}`;
    const percent = Math.min(100, (subs / subsGoal) * 100);
    subsBarFill.style.width = percent + "%";
  }
  updateSubsBar();
  setInterval(() => {
    if (subs < subsGoal) {
      subs += Math.floor(Math.random() * 3); // Sube de a 0, 1 o 2
      if (subs > subsGoal) subs = subsGoal;
      updateSubsBar();
    }
  }, 1800);

  // Mostrar/ocultar menú de selección
  function hideFileMenu() {
    fileSelectorMenu.style.display = "none";
    showFileMenuBtn.style.display = "flex";
  }
  function showFileMenu() {
    fileSelectorMenu.style.display = "flex";
    showFileMenuBtn.style.display = "none";
  }
  showFileMenuBtn.addEventListener("click", showFileMenu);

  // Manejar eventos de reproducción
  videoPlayer.video.addEventListener("play", () => {
    commentsManager.startCommentSync();
    hideFileMenu();
  });

  videoPlayer.video.addEventListener("pause", () => {
    // No es necesario hacer nada aquí, la sincronización se detiene automáticamente
  });

  videoPlayer.video.addEventListener("ended", () => {
    commentsManager.reset();
  });

  // Manejar eventos de cambio de archivo
  videoPlayer.videoFile.addEventListener("change", () => {
    commentsManager.reset();
  });

  // Manejar eventos de cambio de archivo de comentarios
  commentsManager.srtFile.addEventListener("change", () => {
    if (videoPlayer.isPlaying()) {
      commentsManager.startCommentSync();
    }
  });

  // Manejar eventos de teclado
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
        e.preventDefault();
        videoPlayer.togglePlay();
        break;
      case "m":
        videoPlayer.toggleMute();
        break;
      case "f":
        videoPlayer.toggleFullscreen();
        break;
      case "ArrowRight":
        videoPlayer.video.currentTime += 5;
        break;
      case "ArrowLeft":
        videoPlayer.video.currentTime -= 5;
        break;
      case "Escape":
        hideFileMenu();
        break;
    }
  });

  const commentSizeSlider = document.getElementById("commentSizeSlider");
  const commentSliderContainer = document.querySelector(".comment-size-slider-container");
  const commentsOverlay = document.getElementById("commentsOverlay");
  function setCommentFontSizeAndWidth(size) {
    // Tamaño de fuente
    document.documentElement.style.setProperty("--comment-font-size", size + "px");
    document.querySelectorAll(".comment-bubble").forEach((bubble) => {
      bubble.style.fontSize = size + "px";
    });
    // Ancho de la columna (mínimo 180px, máximo 600px, por defecto 30vw)
    let width = Math.max(180, Math.min(600, Math.round(window.innerWidth * (size / 70))));
    // Si el tamaño es el default (22), usar 30vw
    if (size == 22) {
      commentsOverlay.style.width = "";
      document.documentElement.style.setProperty("--comments-overlay-width", "30vw");
    } else {
      commentsOverlay.style.width = width + "px";
      document.documentElement.style.setProperty("--comments-overlay-width", width + "px");
    }
  }
  if (commentSizeSlider) {
    setCommentFontSizeAndWidth(commentSizeSlider.value);
    commentSizeSlider.addEventListener("input", (e) => {
      setCommentFontSizeAndWidth(e.target.value);
    });
  }
  // Ocultar slider durante reproducción
  function hideCommentSlider() {
    if (commentSliderContainer) {
      commentSliderContainer.style.opacity = 0;
      commentSliderContainer.style.visibility = "hidden";
    }
  }
  function showCommentSlider() {
    if (commentSliderContainer) {
      commentSliderContainer.style.opacity = 1;
      commentSliderContainer.style.visibility = "visible";
    }
  }
  videoPlayer.video.addEventListener("play", hideCommentSlider);
  videoPlayer.video.addEventListener("pause", showCommentSlider);
  videoPlayer.video.addEventListener("ended", showCommentSlider);
  // Mostrar slider al cargar la página
  showCommentSlider();
});
