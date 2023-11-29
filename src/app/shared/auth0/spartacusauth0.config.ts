import { NgModule } from '@angular/core';
import { AuthConfig, provideConfig, ClientAuthenticationTokenService } from '@spartacus/core';
import { environment } from 'src/environments/environment';
import { OAuthEvent, EventType, OAuthSuccessEvent } from 'angular-oauth2-oidc';


const tokenFromLS: any = localStorage.getItem('spartacus⚿⚿auth')
let access_token: any = null;

if (tokenFromLS) {
    const authToken: any = localStorage.getItem('spartacus⚿⚿auth');
    const tokenFromLS: any = JSON.parse(authToken)
    const token = tokenFromLS.token
    access_token = (token.access_token) ? token.access_token : null;
}

let responseVal;
if (!access_token && !(window.location.pathname.includes('/create-account'))) {
    responseVal = 'code'
    if (!(window.location.href.includes('code='))
        && !(window.location.href.includes('access_token'))) {
        window.location.href = environment.UIsiteURl + "/";
    }
}
else {
    responseVal = ''
}


@NgModule({
    imports: [],
    exports: [],
    providers: [
        provideConfig(<AuthConfig>{
            authentication: {
                OAuthLibConfig: {
                    responseType: responseVal,
                    redirectUri: environment.UIsiteURl,
                    scope: 'openid profile email',
                    useIdTokenHintForSilentRefresh: true,
                    customQueryParams: {
                        audience: environment.auth0Audience,
                        response_mode: 'query',
                        grant_type: "authorization_code"
                    }
                },
                baseUrl: environment.auth0Domain,
                client_id: environment.auth0Client_id,
                client_secret: environment.auth0Client_secret,
                tokenEndpoint: '/oauth/token',
                revokeEndpoint: 'v2/logout',
                userinfoEndpoint: '/userinfo',
                loginUrl: '/authorize',
            }
        }),
    ]

})

export class SpartacusAuth0ModuleConfig {

    constructor() {
        if (window.location.href.includes('code=')) {

            const urlParams: any = new URLSearchParams(window.location.search);
            let queryArr: any = [];

            for (const [key, value] of urlParams) {
                queryArr.push(value)
            }
        }

    }

}