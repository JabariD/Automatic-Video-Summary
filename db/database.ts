import { Firestore, FieldValue } from "@google-cloud/firestore";

// Firestore (FS) Constants
const kFSUserCollection = "users";

const kFSUserEmailField = "email";
const kFSUserSummariesField = "summaries";

const kFSUserSummariesSummaryField = "summary";
const kFSUserSummariesUrlField = "url";


// Abstracts the database client for the extension.
// C:\Users\denni\AppData\Roaming\gcloud\application_default_credentials.json
class Database {
    constructor() {
        this.dbClient = new Firestore();
    }

    // Sets the summary for the user with the given email and url.
    public async setSummaryForUser(email: string, url: string, summary: string): Promise<void> {
        const query = this.dbClient.collection(kFSUserCollection).where(kFSUserEmailField, '==', email);

        const querySnapshot = await query.get();

        // If the user doesn't exist, create a new user with the given email and summary.
        if (querySnapshot.empty) {
            console.log("User not found. Creating user with email: " + email)

            await this.dbClient.collection(kFSUserCollection).add({
                /*kFSUserEmailField=*/email: email,
                /*kFSUserSummariesField=*/summaries: FieldValue.arrayUnion({[kFSUserSummariesUrlField]: url, [kFSUserSummariesSummaryField]: summary})
            });
            return;
        }

        let summaries = querySnapshot.docs[0].get(kFSUserSummariesField);

        // TODO(payton): once stripe api is integrated, we can have multiple limits based on the tier of the user.
        // For now default at 100 videos.
        if (summaries.length > this.kMaxSummariesPerUser) {
            summaries.shift();
        }

        // if url already exists, update the summary on that url
        for (let i = 0; i < summaries.length; i++) {
            if (summaries[i][kFSUserSummariesUrlField] === url) {
                summaries[i][kFSUserSummariesSummaryField] = summary;
                await this.dbClient.collection(kFSUserCollection).doc(querySnapshot.docs[0].id).update({[kFSUserSummariesField]: summaries});
                return;
            }
        }

        summaries.push({[kFSUserSummariesUrlField]: url, [kFSUserSummariesSummaryField]: summary});

        // Update the user with the new summary.
        await this.dbClient.collection(kFSUserCollection).doc(querySnapshot.docs[0].id).update({[kFSUserSummariesField]: summaries});
    }

    // Returns the summary for the user if it exists. Otherwise, throws an error.
    public async getSummaryForUser(email: string, url: string): Promise<string> {
        const query = this.dbClient.collection(kFSUserCollection).where(kFSUserEmailField, '==', email);
        // Execute the query.
        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            console.log("Email not found. Returning empty string for summary for user with email: " + email);
            return "";
        }

        const summaries = querySnapshot.docs[0].get(kFSUserSummariesField);

        // Look for summary with matching url.
        for (let i = 0; i < summaries.length; i++) {
            if (summaries[i][kFSUserSummariesUrlField] === url) {
                return summaries[i][kFSUserSummariesSummaryField];
            }
        }
        
        throw new Error("Unable to find summary for user with email: " + email + " and url: " + url);
    }


    private dbClient : Firestore;
    private kMaxSummariesPerUser = 100;
}

export { Database };