
const qs = require('querystring');
const rssparser = require('parse-rss');

module.exports = ({

    APIURL: 'https://itunes.apple.com/search?',

    request: function(data){
        data.media = data.media || 'podcast';
        data.term = data.term.split(' ').join('+');
        return fetch(this.APIURL + qs.stringify(data)).then((res) => res.json());
    },

    searchPodcasts: function(term){
        return this.request({
            'term':term
        }).then(data => {
            let res = [];
            if (data.resultCount < 1) return [];

            for (var i = 0; i < data.results.length; i++) {
                let entry = data.results[i];
                res[i] = {
                    artistName: entry.artistName,
                    artworkUrl100: entry.artworkUrl100,
                    collectionName: entry.collectionName,
                    feedUrl: entry.feedUrl,
                    genres: entry.genres,
                    trackName: entry.trackName
                };
            }

            return res;
        });
    },

    getEpisodes: function(feedUrl){
        return new Promise((resolve, reject) => {
            rssparser(feedUrl, (err, rss) => {
                if (err)
                return reject( err );

                if (rss.length === 0)
                return reject( new Error("no results for this feedUrl: "+feedUrl) );

                let results = [];
                for (let i = 0; i < rss.length; i++) {
                    let date = new Date(rss[i].date);
                    results.push({
                        'title': rss[i].title,
                        'url': rss[i].enclosures[0].url,
                        'author': rss[i].author,
                        'link': rss[i].link,
                        'date': date,
                        'human_date': this.toHumanDate(date)
                    });
                }

                resolve(results.sort((a, b) => b.date.getTime() - a.date.getTime()));
            });
        });
    },

    toHumanDate: function(date){
        let days = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        let year = date.getFullYear().toString();

        if (days.length != 2) days = '0'+days;
        if (days.length != 2) month = '0'+month;
        if (days.length != 2) year = '0'+year;

        return days+'.'+month+'.'+year;
    }

});
