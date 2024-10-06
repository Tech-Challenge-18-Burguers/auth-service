import { Authenticated } from "../entity/Authenticated";
import IdentityProviderService from "../service/IdentityProviderService";

export default class LoginWithDocumentUseCase {
 
    constructor(private readonly identityProvider: IdentityProviderService) {

    }

    async execute(documentNumber: string): Promise<Authenticated> {
        const response = await this.identityProvider.authenticateWithUsername(documentNumber)
        return {
            accessToken: response.accessToken,
            idToken: response.idToken,
            expireIn: response.expireIn
        }
    }
}