# cmd-dictionary-game
Follow the instructions to use this locally.   

```
git clone https://github.com/s-xync/cmd-dictionary-game.git

cd cmd-dictionary-game

echo "
API_BASE_URL=https://fourtytwowords.herokuapp.com
API_KEY=<FILL_YOUR_API_KEY_HERE>
" > .env

npm install

node dict.js defn <word>

node dict.js syn <word>

node dict.js ant <word>

node dict.js ex <word>

node dict.js <word>

node dict.js

node dict.js play
```

### NOTE: Only the synonyms that have not been shown on screen will be accepted as answers.
