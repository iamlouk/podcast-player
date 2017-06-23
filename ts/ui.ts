
module.exports = ({

  spinner: {
    $icon: document.querySelector('header #icon'),
    isSpinning: false,

    start: function(){
      // this.$iconDefault.style.display = 'none';
      // this.$iconSpinner.style.display = 'inline-block';

      if (!this.isSpinning) {
        this.isSpinning = true;

        this.$icon.classList.add('fa-spin');
        this.$icon.classList.add('fa-refresh');
        this.$icon.classList.remove('fa-podcast');
      }
    },

    stop: function(){
      // this.$iconDefault.style.display = 'inline-block';
      // this.$iconSpinner.style.display = 'none';
      if (this.isSpinning) {
        this.isSpinning = false;

        this.$icon.classList.remove('fa-spin');
        this.$icon.classList.remove('fa-refresh');
        this.$icon.classList.add('fa-podcast');
      }
    },
  },

  init: function(){
    delete this.init;
    return this;
  }

}).init();
