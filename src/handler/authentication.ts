import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import LoginWithDocumentUseCase from '../core/usecase/LoginWithDocumentUseCase'
import CognitoIdentityProviderService from '../application/service/CognitoIdentityProviderService'

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    const identityProvider = new CognitoIdentityProviderService()
    const usecase = new LoginWithDocumentUseCase(identityProvider)
    const response = await usecase.execute('xptp')

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}