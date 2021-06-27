#!/bin/sh

#npm run compile

pm2 delete gtranslatewin-uk
CONFIG=".env.uk"  pm2 start --name gtranslatewin-uk  build/src/index.js
pm2 save