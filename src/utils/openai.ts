import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// const OpenAIApiClient = new OpenAIApi(configuration);

const chatCompletionURL = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;
const userID = process.env.USER_ID;

export { 
    chatCompletionURL,
    apiKey,
    userID
 }