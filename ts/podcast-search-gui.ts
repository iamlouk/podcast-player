let $ = (sel: String, node = document) => node.querySelector(sel);
let $$ = (sel: String, node = document) => node.querySelectorAll(sel);


let ui = require('./ui');
let player = require('./player');
let podcastapi = require('./pdcapi');

module.exports = ({

  $selectedPodcast: $('#selected-podcast'),
  $selectedEpisode: $('#selected-episode'),
  $ul: $('.list ul'),

  init: function(){

    this.$selectedPodcast.addEventListener('keydown', (event) => {
      if (event.keyCode == 13) {
        ui.spinner.start();
        let term = this.$selectedPodcast.value;
        podcastapi.searchPodcasts(term).then((data) => {
          this.$ul.innerHTML = '';
          data.forEach((podcast, index) => {
            let genres = podcast.genres.join(', ');
            this.$ul.innerHTML += `
            <li data-id="${ index }" data-feedurl="${ podcast.feedUrl }">
              <span class="collectionName">${ podcast.collectionName }</span>
              <span class="artistName">${ podcast.artistName }</span>
              <span class="genres">${ genres }</span>
            </li>
            `;
          });

          // console.log(data);

          if (data.length == 0)
            this.$ul.innerHTML = '<li class="warn">Keine Podcasts <i class="fa fa-frown-o"></i></li>';

          setTimeout(() => {
            let onClick = (event) => {
              let target = event.target.tagName.toLowerCase() == 'li' ? event.target : event.target.parentNode;
              let feedUrl = target.dataset['feedurl'];
              let podcastName = $('.collectionName', target).innerHTML;
              this.$selectedPodcast.value = podcastName;

              // console.log('Podcast ausgewählt: ', target, feedUrl);
              this.showEpisodes(feedUrl);
            };

            let items = $$('li', this.$ul);
            for (let i = 0; i<items.length; i++)
              items[i].onclick = onClick;

            ui.spinner.stop();
          }, 0);
        });
      }
    });

    delete this.init;
    return this;
  },

  showEpisodes: function(feedUrl){
    ui.spinner.start();
    podcastapi.getEpisodes(feedUrl).then((episodes) => {

      this.$ul.innerHTML = '';
      episodes.forEach((episode, index) => {
        this.$ul.innerHTML += `
        <li data-id="${ index }" data-link="${ episode.link }" data-url="${ episode.url }">
          <span class="collectionName">${ episode.title }</span>
          <span class="artistName">${ episode.author }</span>
          <span class="genres">${ episode.human_date }</span>
        </li>
        `;
      });

      if (episodes.length == 0)
        this.$ul.innerHTML = '<li class="warn">Keine Episoden <i class="fa fa-frown-o" aria-hidden="true"></i></li>';

      setTimeout(() => {
        let onClick = (event) => {
          let target = event.target.tagName.toLowerCase() == 'li' ? event.target : event.target.parentNode;
          let episodeName = $('.collectionName', target).innerHTML;
          this.$selectedEpisode.value = episodeName;
          target.classList.add('selected');
          // console.log('Episode: ', episodeName);
          player.play({
            title: episodeName,
            url: target.dataset['url'],
            link: target.dataset['link']
          });
        };

        let items = $$('li', this.$ul);
        for (let i = 0; i<items.length; i++)
          items[i].onclick = onClick;

        ui.spinner.stop();
      }, 0);

    }, (reason) => {
      console.warn(reason);
      this.$ul.innerHTML = '<li class="warn">Error <i class="fa fa-frown-o"></i>!</li>';
      ui.spinner.stop();
    });
  }

});
