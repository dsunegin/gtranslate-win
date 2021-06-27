#!/bin/sh

#npm run compile

pm2 delete gtranslatewin-it
CONFIG=".env.it"  pm2 start --name gtranslatewin-it  build/src/index.js --cron "40 */2 * * *"
pm2 save