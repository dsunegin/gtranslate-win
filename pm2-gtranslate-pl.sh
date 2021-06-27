#!/bin/sh

#npm run compile

pm2 delete gtranslatewin-pl
CONFIG=".env.pl"  pm2 start --name gtranslatewin-pl  build/src/index.js
pm2 save