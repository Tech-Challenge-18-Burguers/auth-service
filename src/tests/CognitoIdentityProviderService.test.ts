import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import CognitoIdentityProviderService, { IdentityProviderConfiguration } from "../application/service/CognitoIdentityProviderService"
import { randomUUID } from 'node:crypto'
import { AuthenticationStatus } from "../core/service/IdentityProviderService"

describe('CognitoIdentityProviderService', () => {
    it('should be create user', async () => {
        const configuration: IdentityProviderConfiguration = { clientId: 'x', userPoolId: 'y' }
        const client = jest.mocked(new CognitoIdentityProviderClient())
        client.send = jest.fn().mockReturnValue({ $metadata: { httpStatusCode: 200 } })

        const username = '26534306069'

        const service = new CognitoIdentityProviderService(client, configuration)
        const response = await service.createUser({ username, password: username })
        expect(response.username).toBe(username)
    })

    it('should be not create user', async () => {
        const configuration: IdentityProviderConfiguration = { clientId: 'x', userPoolId: 'y' }
        const client = jest.mocked(new CognitoIdentityProviderClient())
        client.send = jest.fn().mockReturnValue({ $metadata: { httpStatusCode: 400 } })

        const username = '26534306069'

        const service = new CognitoIdentityProviderService(client, configuration)
        const response = service.createUser({ username, password: username })
        expect(response).rejects.toThrow('User not created')
    })

    it('should be login successfully', async () => {
        const configuration: IdentityProviderConfiguration = { clientId: 'x', userPoolId: 'y' }
        const client = jest.mocked(new CognitoIdentityProviderClient())
        client.send = jest.fn().mockReturnValue({ 
            $metadata: { httpStatusCode: 200 },
            AuthenticationResult: {
                AccessToken: randomUUID(),
                IdToken: randomUUID(),
                ExpiresIn: 5000,
                RefreshToken: randomUUID()
            }
        })

        const username = '26534306069'

        const service = new CognitoIdentityProviderService(client, configuration)
        const response = await service.authenticateWithUsername({ username, password: username })
        expect(response.status).toBe(AuthenticationStatus.SUCCESS)
    })

    it('should be login successfully', async () => {
        const configuration: IdentityProviderConfiguration = { clientId: 'x', userPoolId: 'y' }
        const client = jest.mocked(new CognitoIdentityProviderClient())
        client.send = jest.fn().mockReturnValue({ $metadata: { httpStatusCode: 400 } })

        const username = '26534306069'

        const service = new CognitoIdentityProviderService(client, configuration)
        const response = await service.authenticateWithUsername({ username, password: username })
        expect(response.status).toBe(AuthenticationStatus.FAILURE)
    })
})