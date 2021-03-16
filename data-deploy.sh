#!/bin/bash
echo "started 1"
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 14.15.5
eval $(ssh-agent)
ssh-add ~/.ssh/id_ed25519
ssh-add -l
npm run data-deploy
echo "finisehd"
