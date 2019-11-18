require("dotenv").config();
const axios = require("axios");
const _ = require("lodash");
const readlineSync = require("readline-sync");

/**
 * 🔥 Please create a .env file with the API_KEY 🔥
 */
const apiBaseURL = process.env.API_BASE_URL;
const api_key = process.env.API_KEY;

const axiosRequest = async url => {
  try {
    const response = await axios.get(url, {
      params: { api_key }
    });
    return { response };
  } catch (err) {
    if (
      err.response &&
      err.response.status === 400 &&
      err.response.data &&
      err.response.data.error === "word not found"
    ) {
      return { err: "Word not available." };
    }
    return { err: "Server error." };
  }
};

const wordDefinitions = async (word, returnData = false) => {
  const { response, err } = await axiosRequest(
    `${apiBaseURL}/word/${word}/definitions`
  );

  if (err) {
    console.log(err);
    return;
  }

  const definitionsData = response.data;

  if (definitionsData.length === 0) {
    if (returnData) {
      return [];
    }
    console.log(`The are no definitions for the word "${word}".`);
    return;
  }

  if (returnData) {
    return definitionsData.map(data => data.text);
  }

  console.log(`The definitions for the word "${word}" are...`);
  definitionsData.forEach((data, index) => {
    console.log(`${index + 1}. ${data.text}`);
  });
  return;
};

const wordSynonyms = async (word, returnData = false) => {
  const { response, err } = await axiosRequest(
    `${apiBaseURL}/word/${word}/relatedWords`
  );

  if (err) {
    console.log(err);
    return;
  }

  const wordSynonyms = response.data.find(
    data => data.relationshipType === "synonym"
  );

  if (
    !wordSynonyms ||
    (wordSynonyms && !wordSynonyms.words) ||
    (wordSynonyms && wordSynonyms.words && wordSynonyms.length === 0)
  ) {
    if (returnData) {
      return [];
    }
    console.log(`The are no synonyms for the word "${word}".`);
    return;
  }

  if (returnData) {
    return wordSynonyms.words;
  }

  console.log(`The synonyms for the word "${word}" are...`);
  wordSynonyms.words.forEach((data, index) => {
    console.log(`${index + 1}. ${data}`);
  });
  return;
};

const wordAntonyms = async (word, returnData = false) => {
  const { response, err } = await axiosRequest(
    `${apiBaseURL}/word/${word}/relatedWords`
  );

  if (err) {
    console.log(err);
    return;
  }

  const wordAntonyms = response.data.find(
    data => data.relationshipType === "antonym"
  );

  if (
    !wordAntonyms ||
    (wordAntonyms && !wordAntonyms.words) ||
    (wordAntonyms && wordAntonyms.words && wordAntonyms.length === 0)
  ) {
    if (returnData) {
      return [];
    }
    console.log(`The are no antonyms for the word "${word}".`);
    return;
  }

  if (returnData) {
    return wordAntonyms.words;
  }

  console.log(`The antonyms for the word "${word}" are...`);
  wordAntonyms.words.forEach((data, index) => {
    console.log(`${index + 1}. ${data}`);
  });
  return;
};

const wordExamples = async word => {
  const { response, err } = await axiosRequest(
    `${apiBaseURL}/word/${word}/examples`
  );

  if (err) {
    console.log(err);
    return;
  }

  const examplesData = response.data.examples;

  if (examplesData.length === 0) {
    console.log(`The are no examples for the word "${word}".`);
    return;
  }

  console.log(`The examples for the word "${word}" are...`);
  examplesData.forEach((data, index) => {
    console.log(`${index + 1}. ${data.text}`);
  });
  return;
};

const wordFullDetails = async word => {
  await wordDefinitions(word);
  console.log();
  await wordSynonyms(word);
  console.log();
  await wordAntonyms(word);
  console.log();
  await wordExamples(word);
  return;
};

const getRandomWord = async () => {
  const { response, err } = await axiosRequest(
    `${apiBaseURL}/words/randomWord`
  );

  if (err) {
    console.log(err);
    return;
  }

  return response.data.word;
};

const findRandomNumber = exclusiveUpperLimit =>
  Math.floor(Math.random() * Math.floor(exclusiveUpperLimit));

const jumbleWord = word => {
  /**
   * https://stackoverflow.com/a/3943985/5512145
   */
  const wordSplit = word.split(""),
    n = wordSplit.length;

  for (var i = n - 1; i > 0; i--) {
    var j = findRandomNumber(i + 1);
    var tmp = wordSplit[i];
    wordSplit[i] = wordSplit[j];
    wordSplit[j] = tmp;
  }

  return wordSplit.join("");
};

const hintDefinition = (definitions = []) => {
  const definition = definitions[findRandomNumber(definitions.length)];
  return {
    definition,
    string: `A definition for this word is... ${definition}`
  };
};

const hintSynonym = (synonyms = []) => {
  const synonym = synonyms[findRandomNumber(synonyms.length)];
  return { synonym, string: `A synonym for this word is... ${synonym}` };
};

const hintAntonym = (antonyms = []) => {
  const antonym = antonyms[findRandomNumber(antonyms.length)];
  return { antonym, string: `An antonym for this word is... ${antonym}` };
};

const hintJumbledWord = word => {
  const jumbledWord = jumbleWord(word);
  return {
    jumbledWord,
    string: `A jumbled word for this word is... ${jumbledWord}`
  };
};

const checkWord = (inputWord, word, synonyms = []) => {
  if (inputWord === word) {
    return true;
  }

  if (synonyms.includes(inputWord)) {
    return true;
  }

  return false;
};

const dictionaryGame = async word => {
  const definitions = await wordDefinitions(word, true);
  const synonyms = await wordSynonyms(word, true);
  const antonyms = await wordAntonyms(word, true);

  const usedSynonyms = [];

  let antonymsUsable = true;
  if (antonyms.length === 0) {
    antonymsUsable = false;
  }

  let playerWon = false;
  let playerQuit = false;

  let hint;

  hint = hintDefinition(definitions);
  console.log(hint.string);

  hint = hintSynonym(synonyms);
  usedSynonyms.push(hint.synonym);
  console.log(hint.string);

  while (!playerWon && !playerQuit) {
    const inputWord = readlineSync.question("\nWhat is your guess?\n");

    playerWon = checkWord(
      inputWord.trim(),
      word,
      _.difference(synonyms, usedSynonyms)
      // _.difference(synonyms, []) // ❗player to win for the synonyms already shown as hints ❗
    );

    if (!playerWon) {
      console.log("Your guess is wrong. ❌");
      let optionSelected = false;
      while (!optionSelected) {
        console.log(
          "\nPlease select one of the following options.(input 1 or 2 or 3)"
        );
        console.log("1. Try again");
        console.log("2. Hint");
        console.log("3. Quit");
        const inputOption = readlineSync.question(
          "\nWhat do you want to choose?\n"
        );
        if (inputOption === "1") {
          optionSelected = true;
        } else if (inputOption === "2") {
          optionSelected = true;
          /**
           * 0 --> definition
           * 1 --> synonym
           * 2 --> jumbled word
           * 3 --> antonym
           */
          console.log("HINT:");
          const hintChoice = antonymsUsable
            ? findRandomNumber(4)
            : findRandomNumber(3);
          if (hintChoice === 0) {
            hint = hintDefinition(definitions);
            console.log(hint.string);
          } else if (hintChoice === 1) {
            hint = hintSynonym(synonyms);
            usedSynonyms.push(hint.synonym);
            console.log(hint.string);
          } else if (hintChoice === 2) {
            hint = hintJumbledWord(word);
            console.log(hint.string);
          } else {
            hint = hintAntonym(antonyms);
            console.log(hint.string);
          }
        } else if (inputOption === "3") {
          optionSelected = true;
          playerQuit = true;
        } else {
          console.log("Invalid option selected.");
        }
      }
    }
  }

  if (playerWon) {
    console.log("You've guessed the correct word. 🎉🎉");
    return;
  }

  if (playerQuit) {
    console.log(`The correct word is "${word}".\n`);
    await wordFullDetails(word);
    return;
  }

  return;
};

const main = async (args = []) => {
  if (args.length === 0) {
    // ⚡ word of the day with full details ⚡
    const randomWord = await getRandomWord();
    console.log(`The word of the day is "${randomWord}".\n`);
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
    await wordFullDetails(args[0]);
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
        console.log(`"${args[0]}" is an invalid command.`);
        return;
    }
  }
};

main(process.argv.slice(2));
