import { IdentityProviderConfiguration } from "../../application/service/CognitoIdentityProviderService";

export default {
    clientId: process.env.COGNITO_CLIENT_ID || '',
    userPoolId: process.env.COGNITO_USER_POOL_ID || ''
} as IdentityProviderConfiguration