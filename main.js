const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const volume = $('#volume');
const player = $('.player');
const playList = $('.playlist');
const playBtn = $('.btn-toggle-play');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $("#audio");
const cd = $('.cd');
const progress = $('#progress');
const song = $('.song');
progress.value = 0;
var songs = [
  {
      name : "Hongkong1",
      singer: "Nguyễn Trọng Tài",
      path: "./music/song1.mp4",
      image: "./image/image1.jpg"
  }, 
  {
      name : "Chờ anh nhé",
      singer: "Hoàng Dũng",
      path: "./music/song2.mp4",
      image: "./image/image2.jpg"
  }, 
  {
      name : "Cảm giác lúc ấy ra sao",
      singer: "Lou Hoàng",
      path: "./music/song3.mp4",
      image: "./image/image3.jpg"
  }, 
  {
      name : "Lạ lùng",
      singer: "Vũ",
      path: "./music/song4.mp4",
      image: "./image/image4.jpg"
  }, 
  {
      name : "Phố không em",
      singer: "Thái Đinh",
      path: "./music/song5.mp4",
      image: "./image/image5.jpg"
  }, 
  {
      name : "Đi để trở về",
      singer: "Soobin Hoàng Sơn",
      path: "./music/song6.mp4",
      image: "./image/image6.jpg"
  }, 
  {
      name : "Đi để trở về 2",
      singer: "Soobin Hoàng Sơn",
      path: "./music/song7.mp4",
      image: "./image/image7.jpg"
  }, 
  {
      name : "Còn gì đau hơn chữ đã từng",
      singer: "Quân AP",
      path: "./music/song8.mp4",
      image: "./image/image8.jpg"
  }, 
  {
      name : "Đàn ông không nói",
      singer: "Phan Mạnh Quỳnh, Karik",
      path: "./music/song9.mp4",
      image: "./image/image9.jpg"
  }, 
  {
      name : "Dấu mưa",
      singer: "Trung Quân",
      path: "./music/song10.mp4",
      image: "./image/image10.jpg"
  }
]
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    indexDelete : -1,
    defineProperties: function(){
      Object.defineProperty(this, 'currentSong', {
        get: function () {
          return songs[this.currentIndex];
        }
      })
    },
    renderSongs: function(){
      const htmls = songs.map((song, index) => {
        if (index !== this.indexDelete)
          return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}", data-index = ${index}>
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option", data-index = ${index}>
                <input type = 'submit' value = 'X'>
              </div>
            </div>        
          `
        });
      $('.playlist').innerHTML = htmls.join("");
      //<i class="fas fa-ellipsis-h"></i>
    },
    
    handleEvents: function(){
      const _this = this;
      const cdWidth = cd.offsetWidth;
 
      this.defineProperties();

      audio.ontimeupdate = function () {
        if (audio.duration){
          const progressPercent = Math.floor((audio.currentTime/audio.duration)*100);
          progress.value = progressPercent; 
        }
      }
      
      //Xử lý cd quay
      const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
        duration: 10000, // 10 seconds
        iterations: Infinity
      });
      cdThumbAnimate.pause();

      document.onscroll = function(){
        var scrollTop = window.scrollY;
        var newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth >= 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth/cdWidth;
      };

      playBtn.onclick = function(){
        if (_this.isPlaying){
          _this.isPlaying = false;
          audio.pause();
          player.classList.remove('playing');
          cdThumbAnimate.pause();
        }else{
          _this.isPlaying = true;
          audio.play();
          player.classList.add('playing');
          cdThumbAnimate.play();
        }
      }

      progress.oninput = function (e) {
        audio.currentTime = e.target.value*audio.duration/100;
      }
      
      //next
      nextBtn.onclick = function () {
        _this.nextSong();
        audio.play();
        _this.renderSongs();
        _this.scrollInToView();
      }
      //prev
      prevBtn.onclick = function(){
        _this.prevSong();
        audio.play();
        _this.renderSongs();
        _this.scrollInToView();
      }
      //random
      randomBtn.onclick = function(e){
        if (_this.isRandom){
          randomBtn.classList.remove('active');
          _this.isRandom = false;
        } else{
          randomBtn.classList.add('active');
          _this.isRandom = true;
        }
      }
      //Khi het bai
      audio.onended = function(){
        if (_this.isRepeat){
          _this.renderSongs();
          audio.play();
        }
        else if (_this.isRandom){
          _this.randomSong();
          _this.renderSongs();
          audio.play();
        } 
        else{
          _this.nextSong();
          audio.play();
          _this.renderSongs();
        }
      }
      //repeat
      repeatBtn.onclick = function(){
        if (_this.isRepeat){
          repeatBtn.classList.remove('active');
          _this.isRepeat = false;
        }else{
          repeatBtn.classList.add('active');
          _this.isRepeat = true;
        }
      }

      playList.onclick = function(e){
        var songNode = e.target.closest('.song:not(.active)');
        var optionNode = e.target.closest('.option');
        if (songNode || optionNode){
          if (optionNode){
            const index = Number(optionNode.getAttribute('data-index'));
            _this.indexDelete = index;
            if (index < _this.currentIndex) _this.currentIndex--;
            _this.renderSongs();
            songs.splice(index, 1);
            _this.indexDelete = -1;
            _this.renderSongs();
          }
          else if (songNode){
            const index = Number(songNode.getAttribute('data-index'));
            _this.currentIndex = index;
            _this.loadCurrentSong();
            _this.renderSongs();
            audio.play();
          }
        }
      }
      
      volume.onchange = function(e){
        audio.volume = e.target.value / 100;
      }
    },

    repeatSong: function() {
      this.loadCurrentSong();
    },

    randomSong: function() {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * songs.length);
      } while (newIndex === this.currentIndex);
      
      this.currentIndex = newIndex;
      this.loadCurrentSong();
      this.scrollInToView();  
    },

    nextSong: function(){
      this.currentIndex++;
      if (this.currentIndex >= songs.length){
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },

    prevSong: function(){
      if (this.currentIndex === 0){
        this.currentIndex = songs.length-1;
      }else{
        this.currentIndex--;
      }
      this.loadCurrentSong();
    },

    loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    },

    scrollInToView: function(){
      setTimeout(() => {
        if (this.currentIndex <= 3) {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        } else {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 300);
    },

    start: function(){
      
      this.handleEvents();

      this.loadCurrentSong();
 
      this.renderSongs();
        
    }
}
app.start();
