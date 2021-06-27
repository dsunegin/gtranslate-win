# `gtranslatewin` - google translate proxy based on fastify web server

all : 8085  :   gtranslatewin

ru : 8090
uk : 8091
be : 8092
pl : 8094
en : 8095
fr : 8096
de : 8097
es : 8098
it : 8099
bg : 8100

all : 8185  :   itranslatewin


#### Clone & Install Dependencies
```bash
git clone https://github.com/dsunegin/gtranslatewin
cd gtranslatewin
npm install
```

Configure your env:

```
cp .env.example .env
```

#### Specify environment:

```
PORT = 8085;
PAGES_NUM = 1;
PAGE_TIMEOUT = 60000;
BEARER = "bearer_1|bearer2|bearer_n"
```
No Auth requered if BEARER not set.

## Running `gtranslatewin`

Either configure `gtranslatewin` to run by pm2 (node process manager) or manually start the `gtranslatewin` process.

To manually start `gtranslatewin` once it is installed:

```bash
npm run compile
npm run start
```

### Start the pm2 

```bash
npm run compile
./pm2-gtranslatewin.sh
```
 
You must have installed pm2 process manager to run pm2-gtranslatewin.sh script.

## *Notice

Fastify hc-pages Plugin used in project is written  for node 14.0 and later.

To avoid error in node version < 14.0 modify line 90:60 (hc-pages.js):

const browser = await puppeteer_1.launch(launchOptions ?? defaultLaunchOptions);

to ->

const browser = await puppeteer_1.launch(launchOptions || defaultLaunchOptions);

in fastify-hc-pages Plugin file:
 
node_modules\@uyamazak\fastify-hc-pages\dist\src\hc-pages.js


## Contact
Denis Sunegin `dsunegin@gmail.com`
