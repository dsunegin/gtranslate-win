#!/bin/sh

#npm run compile

#restart every 1 hour
pm2 delete gtranslatewin
pm2 start --name gtranslatewin  build/src/index.js  --cron "0 */2 * * *"
pm2 save