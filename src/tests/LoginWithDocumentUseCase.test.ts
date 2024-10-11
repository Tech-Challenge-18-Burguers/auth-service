import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import CognitoIdentityProviderService, { IdentityProviderConfiguration } from "../application/service/CognitoIdentityProviderService";
import { AuthenticationStatus } from "../core/service/IdentityProviderService";
import LoginWithDocumentUseCase from "../core/usecase/LoginWithDocumentUseCase"
import { randomUUID } from 'node:crypto'

describe('LoginWithDocumentUseCase', () => {
    it('should be authenticated with success', async () => {
        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: '' }
        const identityProvider = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.authenticateWithUsername = jest.fn().mockReturnValue({
            status: AuthenticationStatus.SUCCESS, 
            data: {
                accessToken: randomUUID(),
                idToken: randomUUID(),
                refreshToken: randomUUID(),
                expireIn: 300
            }
        })

        const usecase = new LoginWithDocumentUseCase(identityProvider);
        const response = await usecase.execute('11000111111')
        expect(response?.accessToken).not.toBeNull()
    })

    it('should be not authenticated', async () => {
        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: '' }
        const identityProvider = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.authenticateWithUsername = jest.fn().mockReturnValue({
            status: AuthenticationStatus.FAILURE, 
        })

        const usecase = new LoginWithDocumentUseCase(identityProvider);
        const response = usecase.execute('11000111111')
        expect(response).resolves.toBeUndefined()
    })
})