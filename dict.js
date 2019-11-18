require("dotenv").config();
const axios = require("axios");
/**
 * 🔥 Please create a .env file with the API_KEY 🔥
 */
const API_KEY = process.env.API_KEY;

const wordDefinitions = async word => {
  console.log("word definitions");
};

const wordSynonyms = async word => {
  console.log("word synonyms");
};

const wordAntonyms = async word => {
  console.log("word antonyms");
};

const wordExamples = async word => {
  console.log("word examples");
};

const wordFullDetails = async word => {
  await wordDefinitions(word);
  await wordSynonyms(word);
  await wordAntonyms(word);
  await wordExamples(word);
};

const getRandomWord = async () => {
  console.log("get random word");
  return "word";
};

const dictionaryGame = async word => {
  console.log("dictionary game");
};

const main = async (args = []) => {
  if (args.length === 0) {
    // ⚡ word of the day with full details ⚡
    const randomWord = await getRandomWord();
    console.log(`The word of the day is ${randomWord}.`);
    await wordFullDetails(randomWord);
    return;
  }

  if (args.length === 1) {
    if (args[0] === "play") {
      // ⚡ dictionary game ⚡
      const randomWord = await getRandomWord();
      await dictionaryGame(randomWord);
      return;
    }

    // ⚡ full details of given word ⚡
    await wordFullDetails(args[1]);
    return;
  }

  if (args.length === 2) {
    switch (args[0]) {
      case "defn":
        // ⚡ definitions of given word ⚡
        await wordDefinitions(args[1]);
        return;
      case "syn":
        // ⚡ synonyms of given word ⚡
        await wordSynonyms(args[1]);
        return;
      case "ant":
        // ⚡ antonyms of given word ⚡
        await wordAntonyms(args[1]);
        return;
      case "ex":
        // ⚡ examples of given word ⚡
        await wordExamples(args[1]);
        return;
      default:
        // ⚡ invalid command ⚡
        console.log(`${args[0]} is an invalid command.`);
        return;
    }
  }
};

main(process.argv.slice(2));
