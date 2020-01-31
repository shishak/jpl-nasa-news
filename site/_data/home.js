var axios  = require('axios');
var toJSON = require('xml2js').parseString;

var url = process.env.MEDIUM_FEED ||'https://www.pipes.digital/feedpreview/1qW4ll9y?feed=https%3A%2F%2Fwww.nasa.gov%2Frss%2Fdyn%2Fbreaking_news.rss';

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        // turn the feed XML into JSON
        toJSON(response.data, function (err, result) {
          // create a path for each item based on Medium's guid URL
          result.rss.channel[0].item.forEach(element => {
            var url = element.link[0].split('/');
            element.path = url[url.length-1].split('?')[0];
          });
          resolve({'url': url, 'posts': result.rss.channel[0].item});
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
