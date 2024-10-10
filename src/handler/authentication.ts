import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import LoginWithDocumentUseCase from '../core/usecase/LoginWithDocumentUseCase'
import CognitoIdentityProviderService from '../application/service/CognitoIdentityProviderService'
import configuration from '../infra/configuration/cognito'
import client from '../infra/aws/cognitoClient'

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        if(!event.body) throw new Error('BadRequest')
    
        const { username } = JSON.parse(event.body)
        const identityProvider = new CognitoIdentityProviderService(client, configuration)
        const usecase = new LoginWithDocumentUseCase(identityProvider)
        const response = await usecase.execute(username)
    
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
        
    } catch (error) {
        return {
            statusCode: 401
        }
    }

}   