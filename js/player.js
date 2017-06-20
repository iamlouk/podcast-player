
const $player = $('.player');

let toHHMMSS = (totalsecs) => {
    let sec_num = parseInt(totalsecs, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) hours   = "0"+hours;
    if (minutes < 10) minutes = "0"+minutes;
    if (seconds < 10) seconds = "0"+seconds;

    return hours+':'+minutes+':'+seconds;
};

module.exports = ({

  audio: $('audio', $player),
  $btnPlayPause: $('.playpause', $player),
  $btnSpeed: $('.speed', $player),
  $btnMute: $('.mute', $player),
  $currentTime: $('.current-time', $player),
  $progressBar: $('.progress-bar', $player),
  $progress: $('.pcast-progress', $player),
  speeds: [ 0.5, 0.7, 0.9, 1.0, 1.2, 1.5, 1.7, 2.0, 3.0 ],
  currentSpeedIndex: 3,

  mute: function(){
    this.audio.muted = true;
    this.$btnMute.innerHTML = "<i class='fa fa-volume-off' aria-hidden='true'></i>";
  },

  unmute: function(){
    this.audio.muted = false;
    this.$btnMute.innerHTML = "<i class='fa fa-volume-up' aria-hidden='true'></i>";
  },

  updateTime: function(millis, total){
    let percentage = Math.floor(((millis * 100) / total) * 10) / 10;
    this.$progressBar.style.width = percentage+'%';
    this.$currentTime.innerHTML = toHHMMSS(millis) + ' / ' + toHHMMSS(total);
  },

  init: function(){
    this.$btnMute.addEventListener('click', (event) => this.audio.muted ? this.unmute() : this.mute(), false);

    this.$btnPlayPause.addEventListener('click', (event) => this.audio.paused ? this.replay() : this.pause(), false);

    let width = this.$progress.offsetWidth;
    this.$progress.addEventListener('click', (event) => {
      this.audio.currentTime = Math.floor(this.audio.duration) * (event.offsetX / width);
    }, false);

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateTime(0, this.audio.duration);
      ui.spinner.stop();
    }, false);

    this.audio.addEventListener('timeupdate', () => this.updateTime(this.audio.currentTime, this.audio.duration), false);

    this.$btnSpeed.addEventListener('click', () => {
      this.currentSpeedIndex = this.currentSpeedIndex + 1 < this.speeds.length ? this.currentSpeedIndex + 1 : 0;
      // console.log(this.currentSpeedIndex);
      let speed = this.speeds[this.currentSpeedIndex];
      this.audio.playbackRate = speed;
      this.$btnSpeed.innerHTML = speed+'x';
    }, false);

    delete this.init;
    return this;
  },

  play: function(options){
    ui.spinner.start();
    // console.log(options);
    this.unmute();
    this.audio.src = options.url;
    this.replay();
  },

  replay: function(){
    this.$btnPlayPause.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
    this.audio.play();
  },

  pause: function(){
    this.$btnPlayPause.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    this.audio.pause();
  }

});





/*
var podcastplayer = (function(){
  var vueel = new Vue({
    el: '#pcast-player-section',
    data: {
      'title':"Titel...",
      'author':"Autor..."
    }
  });

  return {
    vueel: vueel,
    $pcastPlayerWrapper: $('#pcast-player-wrapper')
  };
})();

podcastplayer.playEpisode = function(ep){
  ui.startLoading();

  this.ep = ep;
  this.vueel.title = ep.title;
  this.vueel.author = ep.author;
  this.url = ep.url;

  this.$pcastPlayerWrapper.html("");
  fs.readFile(__dirname + '/pcast-player.html', (err, data) => {
    if (err) throw err;

    this.$pcastPlayerWrapper.html( data.toString() );
    this.reload();

    browserWindow.setTitle('PodcastProton ~ ' + ep.title);
  });
};

podcastplayer.reload = function(){
  var player = document.querySelector('.pcast-player');
  var $player = $(player);


  var audio = player.querySelector('audio');
  var play = player.querySelector('.pcast-play');
  var pause = player.querySelector('.pcast-pause');
  var rewind = player.querySelector('.pcast-rewind');
  var progress = player.querySelector('.pcast-progress');
  var speed = player.querySelector('.pcast-speed');
  var mute = player.querySelector('.pcast-mute');
  var currentTime = player.querySelector('.pcast-currenttime');
  var duration = player.querySelector('.pcast-duration');

  $(audio).attr('src', this.url);
  $player.find('a').attr('href', this.url);

  var currentSpeedIdx = 0;
  var speeds = [ 1, 1.2, 1.5, 2, 0.5, 0.8 ];

  pause.style.display = 'none';

  var toHHMMSS = function(totalsecs){
      var sec_num = parseInt(totalsecs, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;  }
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}

      var time = hours+':'+minutes+':'+seconds;
      return time;
  };

  audio.addEventListener('loadedmetadata', function(){
    progress.setAttribute('max', Math.floor(audio.duration));
    duration.textContent = toHHMMSS(audio.duration);

    ui.stopLoading();
  });

  audio.addEventListener('timeupdate', function(){
    progress.setAttribute('value', audio.currentTime);
    currentTime.textContent = toHHMMSS(audio.currentTime);
  });

  play.addEventListener('click', function(){
    this.style.display = 'none';
    pause.style.display = 'inline-block';
    pause.focus();
    audio.play();
  }, false);

  pause.addEventListener('click', function(){
    this.style.display = 'none';
    play.style.display = 'inline-block';
    play.focus();
    audio.pause();
  }, false);

  rewind.addEventListener('click', function(){
    audio.currentTime -= 30;
  }, false);

  progress.addEventListener('click', function(event){
    audio.currentTime = Math.floor(audio.duration) * (event.offsetX / event.target.offsetWidth);
  }, false);

  speed.addEventListener('click', function(){
    currentSpeedIdx = currentSpeedIdx + 1 < speeds.length ? currentSpeedIdx + 1 : 0;
    audio.playbackRate = speeds[currentSpeedIdx];
    this.textContent  = speeds[currentSpeedIdx] + 'x';
    return true;
  }, false);

  mute.addEventListener('click', function() {
    if(audio.muted) {
      audio.muted = false;
      this.querySelector('.fa').classList.remove('fa-volume-off');
      this.querySelector('.fa').classList.add('fa-volume-up');
    } else {
      audio.muted = true;
      this.querySelector('.fa').classList.remove('fa-volume-up');
      this.querySelector('.fa').classList.add('fa-volume-off');
    }
  }, false);

  this.player = player;
};
*/
