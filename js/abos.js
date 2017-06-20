module.exports = ({

  abos: null,

  loadAbos: function(callback){
    let filepath = path.join(configDirectory, 'podcastabos.json');
    fs.access(filepath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        this.abos = { subscriptions: [] };
        callback();
      } else {
        fs.readFile(filepath, (err, data) => {
          this.abos = JSON.parse(data);
          callback();
        });
      }
    });
  },

  init: function(){

    // console.log('Abos: ', configDirectory);

    this.loadAbos(() => {

    });




    delete this.init;
    return this;
  }

});
