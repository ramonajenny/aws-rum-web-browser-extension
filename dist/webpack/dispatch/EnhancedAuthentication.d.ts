import { Config } from '../orchestration/Orchestration';
import { Credentials } from '@aws-sdk/types';
export declare class EnhancedAuthentication {
    private cognitoIdentityClient;
    private config;
    private credentials;
    constructor(config: Config);
    /**
     * A credential provider which provides AWS credentials for an anonymous
     * (guest) user. These credentials are retrieved from the first successful
     * provider in a chain.
     *
     * Credentials are stored in and retrieved from localStorage. This prevents the client from having to
     * re-authenticate every time the client loads, which (1) improves the performance of the RUM web client and (2)
     * reduces the load on AWS services Cognito and STS.
     *
     * While storing credentials in localStorage puts the credential at greater risk of being leaked through an
     * XSS attack, there is no impact if the credentials were to be leaked. This is because (1) the identity pool ID
     * and role ARN are public and (2) the credentials are for an anonymous (guest) user.
     *
     * Regarding (1), the identity pool ID and role ARN are, by necessity, public. These identifiers are shipped with
     * each application as part of Cognito's Basic (Classic) authentication flow. The identity pool ID and role ARN
     * are not secret.
     *
     * Regarding (2), the authentication chain implemented in this file only supports anonymous (guest)
     * authentication. When the Cognito authentication flow is executed, {@code AnonymousCognitoCredentialsProvider}
     * does not communicate with a login provider such as Amazon, Facebook or Google. Instead, it relies on (a) the
     * identity pool supporting unauthenticated identities and (b) the IAM role policy enabling login through the
     * identity pool. If the identity pool does not support unauthenticated identities, this authentication chain
     * will not succeed.
     *
     * Taken together, (1) and (2) mean that if these temporary credentials were to be leaked, the leaked credentials
     * would not allow a bad actor to gain access to anything which they did not already have public access to.
     *
     * Implements CredentialsProvider = Provider<Credentials>
     */
    ChainAnonymousCredentialsProvider: () => Promise<Credentials>;
    /**
     * Provides credentials for an anonymous (guest) user. These credentials are read from a member variable.
     *
     * Implements CredentialsProvider = Provider<Credentials>
     */
    private AnonymousCredentialsProvider;
    /**
     * Provides credentials for an anonymous (guest) user. These credentials are read from localStorage.
     *
     * Implements CredentialsProvider = Provider<Credentials>
     */
    private AnonymousStorageCredentialsProvider;
    /**
     * Provides credentials for an anonymous (guest) user. These credentials are retrieved from Cognito's enhanced
     * authflow.
     *
     * See https://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
     *
     * Implements CredentialsProvider = Provider<Credentials>
     */
    private AnonymousCognitoCredentialsProvider;
    private renewCredentials;
}
