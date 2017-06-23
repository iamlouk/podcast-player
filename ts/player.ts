

let toHHMMSS = (totalsecs) => {
    let sec_num = parseInt(totalsecs, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    return (hours < 10 ? '0' + hours : hours.toString())+':'+
			(minutes < 10 ? '0' + minutes : minutes.toString())+':'+
			(seconds < 10 ? '0' + seconds : seconds.toString());
};

const $player = document.querySelector('.player');
import ui from './ui';

export default ({

  audio: $player.querySelector('audio'),
  $btnPlayPause: $player.querySelector('.playpause'),
  $btnSpeed: $player.querySelector('.speed'),
  $btnMute: $player.querySelector('.mute'),
  $currentTime: $player.querySelector('.current-time'),
  $progressBar: $player.querySelector('.progress-bar'),
  $progress: $player.querySelector('.pcast-progress'),
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
