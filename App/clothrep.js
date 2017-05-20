const {shell} = require('electron');
var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');
var open = require("open");

function doDate() {
    var str = "";
    var now = new Date();
    str = now.toDateString() +' '+now.toLocaleTimeString() ;
    document.getElementById("time").innerHTML = str;
}

function navLink(link) {
  shell.openExternal(link)
}

function getPosts(limit, subreddit) {
  var redditLinks = [];
  var taobaoLinks = [];
  var url = "https://www.reddit.com/r/"+subreddit+"/.json?limit="+limit

  request(url, function (error, response, body) {
    var parsed = JSON.parse(body);
    for (var i = 0; i < limit; i++) {
      if (parsed.data.children[i].data.url.includes("taobao")) {
        taobaoLinks.push(parsed.data.children[i].data.url)
      }
      if (parsed.data.children[i].data.url.includes("reddit")) {
        redditLinks.push(parsed.data.children[i].data.url)
      }
    }
  });

  setTimeout(function () {
    for (var x = 0; x < taobaoLinks.length; x++) {
      request(taobaoLinks[x], function(error, response, html) {
        if (!error) {
          var $ = cheerio.load(html);
          if ($('span.t-title').text()) {
            document.getElementById('items').innerHTML += '<a href="#"><p>"'+$('span.t-title').text()+'"</p></a>'
          }

        }
      })
    }
  }, 5000)
}

getPosts(100, "fashionreps");

setInterval(doDate, 1000);
