import User from "../entity/User";
import IdentityProviderService from "../service/IdentityProviderService";

export default class CreateUserUseCase {
    
    private readonly identityProvider: IdentityProviderService

    constructor(identityProvider: IdentityProviderService) {
        this.identityProvider = identityProvider
    }

    async execute(user: User): Promise<User | undefined> {
        try {
            const response = await this.identityProvider.createUser({
                username: user.username,
                password: user.username
            })
    
            return { username: response.username }
            
        } catch (error: any) {
            console.log(error.message, error)
            return 
        }
    }
}