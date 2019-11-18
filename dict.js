require("dotenv").config();
const axios = require("axios");
const _ = require("lodash");

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

const wordDefinitions = async word => {
  const { response, err } = await axiosRequest(
    `${apiBaseURL}/word/${word}/definitions`
  );

  if (err) {
    console.log(err);
    return;
  }

  const definitionsData = response.data;

  if (definitionsData.length === 0) {
    console.log(`The are no definitions for the word "${word}".`);
    return;
  }

  console.log(`The definitions for the word "${word}" are...`);
  definitionsData.forEach((data, index) => {
    console.log(`${index + 1}. ${data.text}`);
  });
  return;
};

const wordSynonyms = async word => {
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
    console.log(`The are no synonyms for the word "${word}".`);
    return;
  }

  console.log(`The synonyms for the word "${word}" are...`);
  wordSynonyms.words.forEach((data, index) => {
    console.log(`${index + 1}. ${data}`);
  });
  return;
};

const wordAntonyms = async word => {
  console.log("word antonyms");
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
  await wordSynonyms(word);
  await wordAntonyms(word);
  await wordExamples(word);
  return;
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
    console.log(`The word of the day is "${randomWord}".`);
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
        console.log(`"${args[0]}" is an invalid command.`);
        return;
    }
  }
};

main(process.argv.slice(2));
