const fs = require('fs');
const puppeteer = require('puppeteer');
const {docopt} = require('docopt');

/* HaxBall Server Script
 * This script launches the headless browser instance and loads the script for HaxBall
 *
 * Takes the ReCaptcha token obtained at: https://www.haxball.com/headlesstoken as a parameter
 * Outputs the URL of the newly created room and remains running for the room to stay open
 */

const doc = `Usage:
  server.js <name> <token> [options] [--debug]
  server.js --gui <name> [<token>] [options] [--debug]
  server.js --version

Arguments:
  <name>            HaxBall room name
  <token>           Headless token obtained from https://www.haxball.com/headlesstoken

Options:
  -p --players=<p>  Max players
  -t --time=<t>     Time limit
  -s --score=<s>    Score limit
  --public          Make room public
  --gui             Show the browser window
  --debug           Enable debug messages
  --version         Show script version
  -h --help         Show this message
`;

(async () => {
  // utility to print debug messages to stderr
  const logger = msg => { if (debug) console.error(msg) };

  // parse arguments
  const args = docopt(doc, {version: '1.0.0'});
  const debug = args['--debug'];

  logger({args: args});

  // open and config browser
  const browser = await puppeteer.launch({headless: !args['--gui']});

  // get default tab
  const [page] = await browser.pages();

  // hook program close to closing this tab
  page.on('close', () => browser.close());

  // navigate to headless haxball page
  await page.goto('https://html5.haxball.com/headless');

  // put haxball arguments on a variable within the browser for the script to read
  const roomArgs = {
    roomName: args['<name>'],
    public: args['--public'],
    token: args['<token>'],
  };
  if (args['--players']) roomArgs['maxPlayers'] = parseInt(args['--players']);
  if (args['--score']) roomArgs['scoreLimit'] = parseInt(args['--score']);
  if (args['--time']) roomArgs['timeLimit'] = parseInt(args['--time']);

  logger({roomArgs: roomArgs});

  await page.evaluate(`const roomArgs = ${JSON.stringify(roomArgs)};`);

  // load HaxBall script into page (need to wait for the iframe to load)
  setTimeout(() => fs.readFile('haxball.js', 'utf8', (err, hbScript) => {
    if (err) throw err;

    page.evaluate(hbScript).then(() => {
      // identify frame
      const iframe = page.frames().find(
        frame => frame.parentFrame() !== null
      );

      // look for room url within frame
      iframe.waitForSelector('#roomlink a').then(
        eh => eh.getProperty('href')
      ).then(
        jsh => jsh.jsonValue()
      ).then(
        href => console.log(href)
      );
    });
  }), 1e3);
})();
