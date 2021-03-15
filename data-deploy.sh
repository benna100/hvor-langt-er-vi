#!/bin/bash
echo "started 1"
nvm use 14.15.5
eval $(ssh-agent)
ssh-add ~/.ssh/id_ed25519
ssh-add -l
npm run data-deploy
echo "finisehd"
