![Automatic Video Summary Logo](https://github.com/JabariD/Automatic-Video-Summary/blob/main/docs/logo.png?raw=true)

  
  

### Objective

  

Define a video summary Google extension that can be used any website playing a video.

  

### Background

  

It can be annoying watching educational videos or any type of video really. Your hinged to what the creator allows you to see. But with text, you're allowed to skim and navigate to parts are the most interesting. Text allows key ideas to jump out at you and not have to take furious notes. It also encourages further curiosity.

  

### Overview

  

AVS is a tool that allows a user to get summaries off a video they are watching on the internet.

## Developer Notes
### Learnings
- Be aware of where deploying it and how "complex" the setup process is.
	- I found AWS Lambda to be the most difficult.
	- I tried using Vercel, but they had a timeout limit.
	- Then I finally settled on Google Cloud Run that had the simplest setup process and could instantly receive traffic.
- Before creating all these accounts, it's better to create a list of requirements and spend possible a full SWE day evaluating each option and if they fit.

### Frontend
For the frontend we are using React and Bootstrap. To update make sure to run `npm run build`. The build/dist folder that gets created is the entire extension and can be uploaded directly to the Chrome webstore.
- Here we take the approach that we have 2 "versions" of our app. TypeScript version and the Built version (JavaScript).

To configure the extension edit the manifest.json file.

### Backend
For the backend we are using TypeScript, Node.js, and Jest. 
- TypeScript must be compiled into JavaScript to do anything. Therefore there are certain tools that exist to help (not exactly used here though). To do that run `tsc`. Note: Need a config for that. See config in this project.
- Most things need to be configured to run with TypeScript. To run a TypeScript test use `npx jest` or `npx jest -t TestName`. See Jest config in project.
- To simply run a TypeScript file, I think we need to convert it. So use `tsc filepath` and then `node filepath`.
	- This can cause problems with having this file involved in uploading test, so we typically ran files using jest test

For the backend hosting we are using Google Cloud Run Functions. This assumes you already have a project and billing. You also need to install the Google Cloud CLI. Before uploading to Google Cloud make sure to run `npm run build`. These can be built/updated by using this command `gcloud functions deploy summarizer-gcloud-func --gen2 --region=us-central1 --runtime=nodejs18 --source=./dist --entry-point=summarize`
- `summarizer-gcloud-func` - Is the official name of the function that appears in Google Cloud.
- We are using `gen2`
- The region we are deploying is `us-central1`
- The runtime we are using is nodejs18
- Notice the src is the dist. (which is why we to npm run build)
- `summarize` is the JavaScript function that Google Cloud looks for to build. (the function path is in ./dist/index.js)

#### Debugging
If you get the error: The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable.
- This doesn't mean our container didn't listen to proper port, but that it FAILED TO START. 
- This commonly occurs when we forget to copy the package.json into the ./dist directory. Without the package.json, the container doesn't know how to build the project.
- So note: This means if (not your local instance) but if the remote machine cannot start your app and listen you get this error. So you have to give the remote machine everything it needs to do that. (in our case the package.json).

### Database
Using Firebase [Simple schema](https://firebase.google.com/docs/firestore/data-model): `users => doc_auto_id => email, summaries:{url, summary} `.

Note: Firebase is a little finicky. May sure to read docs and look up other examples of how to do your specific action.
