import 'dotenv/config'
import OpenAI from 'openai';

import importDocument from './utils/importDocument';

const openai = new OpenAI();
const documentPath = './documents/';

function userMessage(jobDescription, resume) {
    return {
        role: "user",
        content: `I am going to provide you with two documents enclosed in triple backticks. 
        The first is a job description. 
        The second is the resume of a candidate for that job. 
        Please write a cover letter for that candidate to use for that job based on the resume and the job description.
        Job description: \`\`\`${jobDescription}\`\`\`
        Resume: \`\`\`${resume}\`\`\`
        `
        }
}

function fewShotResponseMessage(coverLetter) {
    return {
        role: "assistant", 
        content: coverLetter
    };
}

const systemMessageContent = "You are a world-class employment consultant, writing cover letters on behalf of highly-qualified candidates based on the job descriptions for the role and the resume provided by the candidate.";
const resume = importDocument(`${documentPath}resume.txt`);
const targetJobDescription = importDocument(`${documentPath}target-job-description.txt`);
const systemMessage = {
    role: "system", 
    content: systemMessageContent
};

const numShots = 2
const shotsArray = [...new Array(numShots)].map((value, index) => index + 1);
const jobDescriptionArray = shotsArray.map((value) => importDocument(`${documentPath}job-description-${value}.txt`)) 
const coverLetterArray = shotsArray.map((value) => importDocument(`${documentPath}cover-letter-${value}.txt`)) 
const fewShotMessages = shotsArray.flatMap((value, index) => [userMessage(jobDescriptionArray[index], resume)].concat(fewShotResponseMessage(coverLetterArray[index])));

const finalMessages = [systemMessage]
    .concat(fewShotMessages)
    .concat(userMessage(targetJobDescription, resume))

async function main() {
  const completion = await openai.chat.completions.create({
    messages: finalMessages,
    model: "gpt-3.5-turbo-16k",
  });

  console.log(completion.choices[0].message.content);
}

main();