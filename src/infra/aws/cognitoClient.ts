import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export default new CognitoIdentityProviderClient({ region: process.env.AWS_REGION })