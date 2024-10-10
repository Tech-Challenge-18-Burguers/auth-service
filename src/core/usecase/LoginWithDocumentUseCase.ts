import { Authenticated } from "../entity/Authenticated";
import IdentityProviderService, { AuthenticationStatus, UsernameAndPassword } from "../service/IdentityProviderService";

export default class LoginWithDocumentUseCase {

    private readonly USER_DEFAULT = "00000000000"
 
    constructor(private readonly identityProvider: IdentityProviderService) {

    }

    async execute(documentNumber: string): Promise<Authenticated | undefined> {
        console.log('Authenticate user with document number...')
        
        const usernameAndPassword: UsernameAndPassword = { 
            username: documentNumber,
            password: documentNumber
        }

        const response = await this.identityProvider
            .authenticateWithUsername(usernameAndPassword)
        
        if(response.status === AuthenticationStatus.SUCCESS) {
            if(!response.data) throw new Error('Access data not found')
            return { ...response.data } 
        }

        return
    }
}