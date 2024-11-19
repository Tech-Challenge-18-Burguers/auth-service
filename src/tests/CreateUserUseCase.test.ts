import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import CognitoIdentityProviderService, { IdentityProviderConfiguration } from "../application/service/CognitoIdentityProviderService"
import IdentityProviderService from "../core/service/IdentityProviderService"
import CreateUserUseCase from "../core/usecase/CreateUserUseCase"

describe('CreateUserUseCase', () => {
    it('should be create new user', async () => {
        const document = '88953017068'
        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: 'x', userPoolId: 'y' }
        const identityProvider: IdentityProviderService = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.createUser = jest.fn().mockReturnValue({ username: document })

        const usecase = new CreateUserUseCase(identityProvider)
        const response = await usecase.execute({ username: document })
        expect(response).not.toBeNull()
    })

    it('should be not create new user', async () => {
        const document = '88953017068'
        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: 'x', userPoolId: 'y' }
        const identityProvider: IdentityProviderService = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.createUser = jest.fn().mockImplementation(() => {
            throw new Error('User Not Created')
        })

        const usecase = new CreateUserUseCase(identityProvider)
        const response = usecase.execute({ username: document })
        expect(response).resolves.toBeUndefined()
    })
})