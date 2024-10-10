import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import User from "../../core/entity/User";
import IdentityProviderService, { AuthenticationResponse, AuthenticationStatus, UsernameAndPassword } from "../../core/service/IdentityProviderService";

export type IdentityProviderConfiguration = {
    clientId: string
}

export default class CognitoIdentityProviderService implements IdentityProviderService {
    
    private readonly client: CognitoIdentityProviderClient
    private readonly configuration: IdentityProviderConfiguration

    constructor(client: CognitoIdentityProviderClient, configuration: IdentityProviderConfiguration) {
        this.client = client
        this.configuration = configuration
    }

    async authenticateWithUsername(usernameAndPassword: UsernameAndPassword): Promise<AuthenticationResponse> {
        
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.configuration.clientId,
            AuthParameters: {
                'USERNAME': usernameAndPassword.username,
                'PASSWORD': usernameAndPassword.password
            }
        })

        const response = await this.client.send(command)
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

        const command = new SignUpCommand({
            ClientId: this.configuration.clientId,
            Username: usernameAndPassword.username,
            Password: usernameAndPassword.password
        })

        const response = await this.client.send(command)
        if(response.$metadata.httpStatusCode === 200) {
            return { username: usernameAndPassword.username }
        }

        throw new Error('User not created')
    }

}