import User from "../entity/User"

export type UsernameAndPassword = {
    username: string
    password: string
}

export enum AuthenticationStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    USER_NOT_REGISTERED = "USER_NOT_REGISTERED"
}

export type AuthenticationResponse = {
    status: AuthenticationStatus
    data?: {
        accessToken: string
        idToken: string
        refreshToken: string
        expireIn: number
    }
}

export default interface IdentityProviderService {
    
    authenticateWithUsername(usernameAndPassword: UsernameAndPassword): Promise<AuthenticationResponse>

    createUser(usernameAndPassword: UsernameAndPassword): Promise<User>
}