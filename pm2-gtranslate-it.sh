#!/bin/sh

#npm run compile

pm2 delete gtranslatewin-it
CONFIG=".env.it"  pm2 start --name gtranslatewin-it  build/src/index.js
pm2 save