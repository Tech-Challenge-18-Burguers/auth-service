import IdentityProviderService from "../../core/service/IdentityProviderService";

export type AuthenticationResponse = {
    accessToken: string
    idToken: string
    expireIn: Number
}

export default class CognitoIdentityProviderService implements IdentityProviderService {
    
    async authenticateWithUsername(username: string): Promise<AuthenticationResponse> {
        return {
            accessToken: '',
            idToken: '',
            expireIn: new Number()
        }
    }

}