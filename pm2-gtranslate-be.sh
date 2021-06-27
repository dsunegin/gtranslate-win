#!/bin/sh

#npm run compile

pm2 delete gtranslatewin-be
CONFIG=".env.be"  pm2 start --name gtranslatewin-be  build/src/index.js
pm2 save