class CommentsManager {
  constructor(videoPlayer) {
    this.videoPlayer = videoPlayer;
    this.commentsOverlay = document.getElementById("commentsOverlay");
    this.reactionsOverlay = document.getElementById("reactionsOverlay");
    this.srtFile = document.getElementById("srtFile");
    this.toggleBtn = document.getElementById("toggleCommentsBtn");
    this.userCountEl = document.getElementById("userCount");
    this.welcomePopupsOverlay = document.getElementById("welcomePopups");
    this.comments = [];
    this.currentCommentIndex = 0;
    this.isCommentsVisible = true;
    this.activeBubbles = [];
    this.userColors = {};
    this.knownUsers = new Set();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.srtFile.addEventListener("change", (e) => this.handleFileSelect(e));
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggleComments());
    }
  }

  toggleComments() {
    this.isCommentsVisible = !this.isCommentsVisible;
    this.commentsOverlay.style.display = this.isCommentsVisible ? "flex" : "none";
    if (this.toggleBtn) {
      this.toggleBtn.style.background = this.isCommentsVisible ? "#9147ff" : "#444";
      this.toggleBtn.title = this.isCommentsVisible ? "Ocultar comentarios" : "Mostrar comentarios";
    }
  }

  async handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await this.readFile(file);
        this.comments = this.parseSRT(text);
        this.currentCommentIndex = 0;
        this.clearComments();
        this.startCommentSync();
      } catch (error) {
        console.error("Error al leer el archivo:", error);
        alert("Error al leer el archivo de comentarios");
      }
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  parseSRT(text) {
    try {
      const blocks = text.trim().split(/\n\s*\n/);
      return blocks
        .map((block) => {
          const lines = block.split("\n");
          if (lines.length < 3) {
            console.warn("Bloque SRT inválido:", block);
            return null;
          }

          const timing = lines[1].split(" --> ");
          if (timing.length !== 2) {
            console.warn("Formato de tiempo inválido:", lines[1]);
            return null;
          }

          const content = lines.slice(2).join("\n");
          let username = "Anónimo";
          let message = content.trim();

          // Mejorar la detección de nicks
          const match = content.match(/^([^:]+):\s*(.*)$/s);
          if (match) {
            username = match[1].trim();
            message = match[2].trim();
            // Si el mensaje está vacío después de quitar el nick, usar el contenido completo
            if (!message) {
              message = content.trim();
            }
          }

          return {
            startTime: this.timeToSeconds(timing[0]),
            endTime: this.timeToSeconds(timing[1]),
            username,
            message,
          };
        })
        .filter((comment) => comment !== null);
    } catch (error) {
      console.error("Error al parsear el archivo SRT:", error);
      return [];
    }
  }

  timeToSeconds(timeStr) {
    try {
      const [hours, minutes, seconds] = timeStr.split(":");
      if (!seconds) {
        console.warn("Formato de tiempo inválido:", timeStr);
        return 0;
      }
      const [secs, ms] = seconds.split(",");
      return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(secs) + parseFloat(ms) / 1000;
    } catch (error) {
      console.warn("Error al convertir tiempo:", timeStr, error);
      return 0;
    }
  }

  startCommentSync() {
    if (!this.videoPlayer.isPlaying()) return;
    const checkComments = () => {
      if (!this.videoPlayer.isPlaying()) return;
      const currentTime = this.videoPlayer.getCurrentTime();
      while (this.currentCommentIndex < this.comments.length) {
        const comment = this.comments[this.currentCommentIndex];
        if (currentTime >= comment.startTime) {
          this.addCommentBubble(comment);
          this.currentCommentIndex++;
        } else {
          break;
        }
      }
      requestAnimationFrame(checkComments);
    };
    checkComments();
  }

  getUserColor(username) {
    if (!this.userColors[username]) {
      // Generar color hash pastel
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      // HSL pastel
      const h = Math.abs(hash) % 360;
      this.userColors[username] = `hsl(${h}, 70%, 65%)`;
    }
    return this.userColors[username];
  }

  addCommentBubble(comment) {
    if (!this.isCommentsVisible) return;
    const bubble = document.createElement("div");
    bubble.className = "comment-bubble";
    const userColor = this.getUserColor(comment.username);
    bubble.innerHTML = `
        <span class="username" style="color:${userColor}">${this.escapeHTML(comment.username)}</span>
        <span class="message">${this.escapeHTML(comment.message)}</span>
    `;
    this.commentsOverlay.appendChild(bubble);
    this.activeBubbles.push(bubble);
    this.ensureBubblesFit();
    this.launchReactions(comment.message);
    this.handleNewUser(comment.username);
  }

  launchReactions(message) {
    // Regex seguro para extraer solo emojis (unicode)
    const emojiRegex =
      /(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+|[\u2600-\u26FF\u2B50\u2B06-\u2B07\u2934-\u2935\u3297-\u3299\uD83C\uDC04-\uDFFF\uD83D\uDC00-\uDE4F\uD83D\uDE80-\uDEFF\uD83E\uDD00-\uDDFF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g;
    const emojis = message.match(emojiRegex);
    if (emojis) {
      emojis.forEach((emoji) => this.createFlyingReaction(emoji));
    }
  }

  createFlyingReaction(emoji) {
    if (!this.reactionsOverlay) return;
    const el = document.createElement("span");
    el.className = "reaction-fly";
    el.textContent = emoji;
    // Posición horizontal aleatoria (en % de ancho)
    el.style.left = `${10 + Math.random() * 70}%`;
    el.style.bottom = "40px";
    // Animación aleatoria (todas válidas)
    const anims = ["flyUp", "fly2", "fly3"];
    el.classList.add(anims[Math.floor(Math.random() * anims.length)]);
    this.reactionsOverlay.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2500);
  }

  ensureBubblesFit() {
    setTimeout(() => {
      let totalHeight = 0;
      const overlayHeight = this.commentsOverlay.clientHeight;
      for (let i = this.activeBubbles.length - 1; i >= 0; i--) {
        totalHeight += this.activeBubbles[i].offsetHeight + 8;
        if (totalHeight > overlayHeight) {
          const oldBubble = this.activeBubbles.shift();
          if (oldBubble && oldBubble.parentNode) {
            oldBubble.style.opacity = "0";
            oldBubble.style.transform = "translateX(40px) scale(0.95)";
            setTimeout(() => {
              if (oldBubble.parentNode) oldBubble.parentNode.removeChild(oldBubble);
            }, 400);
          }
        }
      }
    }, 10);
  }

  clearComments() {
    this.commentsOverlay.innerHTML = "";
    this.currentCommentIndex = 0;
    this.activeBubbles = [];
  }

  escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  reset() {
    this.clearComments();
    this.currentCommentIndex = 0;
  }

  getComments() {
    return this.comments;
  }

  getCurrentCommentIndex() {
    return this.currentCommentIndex;
  }

  handleNewUser(username) {
    if (!this.knownUsers.has(username)) {
      this.knownUsers.add(username);
      this.updateUserCount();
      this.showWelcomePopup(username);
    }
  }

  updateUserCount() {
    if (this.userCountEl) {
      this.userCountEl.textContent = `👥 ${this.knownUsers.size} conectados`;
    }
  }

  showWelcomePopup(username) {
    if (!this.welcomePopupsOverlay) return;
    const popup = document.createElement("div");
    popup.className = "welcome-popup";
    const userColor = this.getUserColor(username);
    // Emoji de usuario aleatorio
    const emojis = ["👋", "🙌", "🎉", "😃", "🤩", "🦾", "🚀", "😎", "🥳", "🤗"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    popup.innerHTML = `<span class="user-emoji">${emoji}</span> <span style="color:${userColor}">${this.escapeHTML(username)}</span> se ha unido al streaming!`;
    this.welcomePopupsOverlay.appendChild(popup);
    setTimeout(() => {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 3000);
  }
}

// Exportar la clase para uso en otros archivos
window.CommentsManager = CommentsManager;
