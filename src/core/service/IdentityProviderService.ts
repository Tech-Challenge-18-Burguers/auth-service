export default interface IdentityProviderService {
    
    authenticateWithUsername(username: string): Promise<any>
}