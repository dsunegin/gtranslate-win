#!/bin/sh

npm run compile

#restart every 1 hour
pm2 delete itranslatewin
CONFIG=".env.i" pm2 start --name itranslatewin  build/src/index-iua.js  --cron "0 */2 * * *"
pm2 save