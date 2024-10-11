import CognitoIdentityProviderService, { IdentityProviderConfiguration } from "../application/service/CognitoIdentityProviderService"
import UserController from "../controller/UserController"
import { randomUUID } from 'node:crypto'
import { AuthenticationStatus } from "../core/service/IdentityProviderService"
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"

describe('UserController', () => {
    it('should be authenticated first attempt', async () => {
        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: '' }
        const identityProvider = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.authenticateWithUsername =jest.fn().mockReturnValue({
            status: AuthenticationStatus.SUCCESS, 
            data: {
                accessToken: randomUUID(),
                idToken: randomUUID(),
                refreshToken: randomUUID(),
                expireIn: 300
            }
        })

        const documentNumber = '05782536071'

        const controller = new UserController(identityProvider)
        const response = controller.authenticate(documentNumber)
        expect(response).resolves.not.toBeNull()
    })

    it('should be authenticated second attempt', async () => {

        const documentNumber = '05782536071'

        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: '' }
        const identityProvider = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.authenticateWithUsername =jest.fn()
            .mockReturnValueOnce({
                status: AuthenticationStatus.FAILURE
            })
            .mockReturnValue({
                status: AuthenticationStatus.SUCCESS, 
                data: {
                    accessToken: randomUUID(),
                    idToken: randomUUID(),
                    refreshToken: randomUUID(),
                    expireIn: 300
                }
            })
        
        identityProvider.createUser = jest.fn().mockReturnValue({
            username: documentNumber
        })

        const controller = new UserController(identityProvider)
        const response = controller.authenticate(documentNumber)
        expect(response).resolves.not.toBeNull()
    })

    it('should be authenticated thirth attempt', async () => {

        const documentNumber = '05782536071'

        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: '' }
        const identityProvider = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.authenticateWithUsername =jest.fn()
            .mockReturnValueOnce({
                status: AuthenticationStatus.FAILURE
            })
            .mockReturnValueOnce({
                status: AuthenticationStatus.FAILURE
            })
            .mockReturnValue({
                status: AuthenticationStatus.SUCCESS, 
                data: {
                    accessToken: randomUUID(),
                    idToken: randomUUID(),
                    refreshToken: randomUUID(),
                    expireIn: 300
                }
            })
        
        identityProvider.createUser = jest.fn().mockReturnValue({
            username: documentNumber
        })

        const controller = new UserController(identityProvider)
        const response = controller.authenticate(documentNumber)
        expect(response).resolves.not.toBeNull()
    })

    it('should be authenticated thirth attempt', async () => {

        const documentNumber = '05782536071'

        const client: CognitoIdentityProviderClient = jest.mocked(new CognitoIdentityProviderClient())
        const configuration: IdentityProviderConfiguration = { clientId: '' }
        const identityProvider = jest.mocked(new CognitoIdentityProviderService(client, configuration))
        identityProvider.authenticateWithUsername =jest.fn()
            .mockReturnValueOnce({
                status: AuthenticationStatus.FAILURE
            })
            .mockReturnValueOnce({
                status: AuthenticationStatus.FAILURE
            })
            .mockReturnValue({
                status: AuthenticationStatus.FAILURE
            })
        
        identityProvider.createUser = jest.fn().mockReturnValue({
            username: documentNumber
        })

        const controller = new UserController(identityProvider)
        const response = controller.authenticate(documentNumber)
        expect(response).rejects.toThrow('Unauthorized')
    })
})