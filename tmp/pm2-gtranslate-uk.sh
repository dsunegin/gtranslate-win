#!/bin/sh

#npm run compile

pm2 delete gtranslatewin-uk
CONFIG=".env.uk"  pm2 start --name gtranslatewin-uk  build/src/index.js --cron "05 */2 * * *"
pm2 save