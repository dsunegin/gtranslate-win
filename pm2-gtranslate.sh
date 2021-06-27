#!/bin/sh

#npm run compile

#restart every 1 hour
pm2 delete gtranslatewin
pm2 start --name gtranslatewin  build/src/index.js
pm2 save