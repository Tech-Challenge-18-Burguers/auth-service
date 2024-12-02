import { AdminConfirmSignUpCommand, AdminCreateUserCommand, AdminSetUserPasswordCommand, CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import User from "../../core/entity/User";
import IdentityProviderService, { AuthenticationResponse, AuthenticationStatus, UsernameAndPassword } from "../../core/service/IdentityProviderService";

export type IdentityProviderConfiguration = {
    clientId: string
    userPoolId: string
}

export default class CognitoIdentityProviderService implements IdentityProviderService {
    
    private readonly client: CognitoIdentityProviderClient
    private readonly configuration: IdentityProviderConfiguration

    constructor(client: CognitoIdentityProviderClient, configuration: IdentityProviderConfiguration) {
        this.client = client
        this.configuration = configuration
    }

    async authenticateWithUsername(usernameAndPassword: UsernameAndPassword): Promise<AuthenticationResponse> {
        
        console.log('Authenticate using username and password', usernameAndPassword)
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.configuration.clientId,
            AuthParameters: {
                'USERNAME': usernameAndPassword.username,
                'PASSWORD': usernameAndPassword.password
            },
        })

        const response = await this.client.send(command)
        console.log('Response', response)
        if(response.$metadata.httpStatusCode !== 200) {
            return {
                status: AuthenticationStatus.FAILURE
            }
        }

        return {
            status: AuthenticationStatus.SUCCESS,
            data: {
                accessToken: response.AuthenticationResult?.AccessToken || '',
                idToken: response.AuthenticationResult?.IdToken  || '',
                expireIn: response.AuthenticationResult?.ExpiresIn  || 0,
                refreshToken: response.AuthenticationResult?.RefreshToken  || ''
            }
        }
    }
    
    async createUser(usernameAndPassword: UsernameAndPassword): Promise<User> {

        const command = new AdminCreateUserCommand({ 
            Username: usernameAndPassword.username,
            UserPoolId: this.configuration.userPoolId,
            TemporaryPassword: usernameAndPassword.password,
            UserAttributes: [
                { Name: "email", Value: `${usernameAndPassword.username}@email.com` },
                { Name: "email_verified", Value: "true" }
            ],
            MessageAction: 'SUPPRESS'
        })

        const response = await this.client.send(command)
        console.log('Response', response)
        if(response.$metadata.httpStatusCode !== 200) {
            console.error(`Error on create new user: ${response.$metadata.httpStatusCode}`)
            throw new Error(`User not created`)
        }

        await this.confirmUser(usernameAndPassword.username, usernameAndPassword.password)

        return { username: usernameAndPassword.username }
    }
    
    async confirmUser(username: string, password: string) {
        const updateCommand = new AdminSetUserPasswordCommand({ 
            Username: username,
            Password: password,
            Permanent: true,
            UserPoolId: this.configuration.userPoolId
        })
    
        const response = await this.client.send(updateCommand)
        if(response.$metadata.httpStatusCode !== 200) {
            console.error(`Error on confirm user: ${response.$metadata.httpStatusCode}`)
            throw new Error(`User not Confirmed`)
        }
    }

}