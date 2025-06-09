class VideoPlayer {
  constructor() {
    this.video = document.getElementById("videoPlayer");
    this.videoFile = document.getElementById("videoFile");
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.videoFile.addEventListener("change", (e) => this.handleFileSelect(e));
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.video.src = url;
      this.video.load();
    }
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  getCurrentTime() {
    return this.video.currentTime;
  }

  getDuration() {
    return this.video.duration;
  }

  isPlaying() {
    return !this.video.paused;
  }
}

// Exportar la clase para uso en otros archivos
window.VideoPlayer = VideoPlayer;
