import { Authenticated } from "../core/entity/Authenticated";
import IdentityProviderService from "../core/service/IdentityProviderService";
import CreateUserUseCase from "../core/usecase/CreateUserUseCase";
import LoginWithDocumentUseCase from "../core/usecase/LoginWithDocumentUseCase";

export default class UserController {
 
    private readonly DEFAULT_DOCUMENT = '00000000000'

    constructor(private readonly identityProvider: IdentityProviderService) {

    }

    async authenticate(documentNumber: string): Promise<Authenticated> {
        console.log('first attempt')
        const loginWithDocument = new LoginWithDocumentUseCase(this.identityProvider)

        try {
            const authenticated = await loginWithDocument.execute(documentNumber)
    
            if(authenticated) {
                return authenticated
            }
            
        } catch (error: any) {
            console.error(error.message, error)
            console.log('create new user with document')
            const createUser = new CreateUserUseCase(this.identityProvider)
            const user = await createUser.execute({ username: documentNumber })
            
            if(user) {
                console.log('second attempt')
                const response = await loginWithDocument.execute(user.username)
                if(response) {
                    return response
                }
            }

            console.log('thirth attempt')
            const authenticatedEmpty = await loginWithDocument.execute(this.DEFAULT_DOCUMENT)
            if(!authenticatedEmpty) throw new Error('Unauthorized')
            return authenticatedEmpty
        }

        throw new Error('Unexpected Error')

    }
}