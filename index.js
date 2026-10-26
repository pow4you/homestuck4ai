import http from 'node:http';
import * as cheerio from 'cheerio';



http.createServer(async function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const url = req.url;
  const comic = url.split('/')[1];
  const page = url.split('/')[2] ? url.split('/')[2] : 0;

  if (comic === 'bc') {
    res.write(
        '<header>' +
        '<h1> Homestuck Beyond Canon </h1>' +
        `<p>Page ${page} </p>` +
        '</header>'
    );

    let furl = "https://beyondcanon.com/story/" + page;

    const options = {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        Connection: 'keep-alive',
      },
    };

    fetch(furl, options)
    .then( cont => cont.text())
    .then( html => {
      const $ = cheerio.load(html);

      const el = $('[id="S:0"]');
      el.hidden = false;

      console.log(el.html());
      el.find('section.comic-navigation').remove();
      el.find('footer').remove();

      res.end(el.html())
    })








  } else if (comic === 'hs') {
    res.write('Homestuck propper');
    res.end();
  } else if (comic === 'ep') {
    res.write('Homestuck epilogues');
    res.end();
  } else {
    res.write('Hello World!');
    res.end();
  }
}).listen(3000, function () {
  console.log("server start at port 3000");
});