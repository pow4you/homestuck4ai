import http from 'node:http';
import * as cheerio from 'cheerio';



http.createServer(async function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const url = req.url;
  const comic = url.split('/')[1];
  const page = url.split('/')[2] ? parseInt(url.split('/')[2]) : 0;

  if (comic === 'bc') {
    res.write(`
      <header>
        <h1> Homestuck Beyond Canon </h1>
        <p>Page ${page} </p>
      </header>
    `);

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

      let $target = $('[id="S:0"]');

      if ($target.length === 0) {
        $target = $('main');
      } else {
        const $main = $('<main></main>');
        $main.append($target.contents()); // move children, not the div itself
        $target.replaceWith($main);
        $target = $main;
      }

      $target.hidden = false;

      $target.find('iframe').remove();
      $target.find('section.comic-navigation').remove();
      $target.find('footer').remove();

      $target
        .find('*')
        .not('img, picture, source, video, audio, a')
        .each((_, el) => {
          el.attribs = {};
        });

      $target.find('img, picture, source, video, audio').each((_, el) => {
        el.attribs = { src: el.attribs?.src };
      });

      $target.find('a').each((_, el) => {
        el.attribs = { href: el.attribs?.href };
      });


      if ($target.html() != null) {
        res.write($target.html());
      } else {
        res.write(`
          <main aria-label="Error">
            This Page is Missing.
          </main>
        `);
      }

      res.write(`
        <h2>Navigation:</h2>
    
        <nav aria-label="Navigation">
          <ul>
            <li><a href="/bc/${page + 1}">Next page</a></li>
            <li><a href="/bc/${page - 1}">Previous page</a></li>
            <li><a href="/bc/0">Overview</a></li>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>                                                 
      `);

      res.end(`
        <footer>
          <p>
            Human made, for Agents -
            &copy; Pow4you 2026 Homestuck4AI -
            <a href="https://homestuck.com/">Homestuck</a> is created by Andrew Hussie.
          </p>
        </footer>
      `);

    });










  } else if (comic === 'hs') {
    res.write('Homestuck propper');

  } else if (comic === 'ep') {
    res.write('Homestuck epilogues');

  } else {
    res.write(`
      <header>
        <h1>Homestuck 4 AI</h1>
        <p>The Agent-First Homestuck mirror.</p>
      </header>
    
        <main>
          
          <h2>Stories:</h2>
    
          <nav aria-label="Stories">
            <ul>
              <li><a href="/hs/">Homestuck</a></li>
              <li><a href="/ep/">Homestuck Epilogues</a></li>
              <li><a href="/bc/">Homestuck Beyond Canon</a></li>
            </ul>
          </nav>
        </main>
    `);

    res.end(`
      <footer>
        <p>
          Human made, for Agents -
          &copy; 2026 Homestuck4AI -
          <a href="https://homestuck.com/">Homestuck</a> is created by Andrew Hussie.
        </p>
      </footer>
    `);
  }



}).listen(3000, function () {
  console.log("server start at port 3000");
});