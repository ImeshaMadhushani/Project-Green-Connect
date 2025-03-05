import { Account, Client, ID } from "appwrite";
import * as Linking from "expo-linking";

const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1") // Change this if you're self-hosting Appwrite
    .setProject("67c19f0f0029f0e7a5ec"); // Replace with your Appwrite project ID

export const account = new Account(client);

 //Generate Google OAuth URL
/* const redirectUri = Linking.createURL('/home');
console.log(redirectUri);
export const googleAuthUrl = `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/67c19f0f0029f0e7a5ec?redirect_uri=${redirectUri}`;
 */




export const loginWithGoogle = async () => {
 
};