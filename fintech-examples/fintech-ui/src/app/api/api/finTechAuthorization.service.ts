/**
 * Open Banking Gateway FinTech Example API
 * This is a sample API that show how develop FinTech use case that invoke banking APIs.  #### User Agent This Api assumes that the PsuUserAgent is a modern browsers that * automatically detects the \"302 Found\" response code and proceeds with the associated location url, * stores httpOnly cookies sent with the redirect under the given domain and path as defined by [RFC 6265](https://tools.ietf.org/html/rfc6265).  This Api also assumes any other PsuUserAgent like a native mobile or a desktop application can simulate this same behavior of a modern browser with respect to 30X and Cookies.  #### SessionCookies and XSRF After a PSU is authenticated with the FinTech environment (either through the simple login interface defined here, or through an identity provider), the FinTechApi will establish a session with the FinTechUI. This is done by the mean of using a cookie called SessionCookie. This SessionCookie is protected by a corresponding XSRF-TOKEN. * The request that sets a SessionCookie also carries a corresponding X-XSRF-TOKEN in the response header. * It is the responsibility of the FinTechUI to parse this X-XSRF-TOKEN and send it back to the FinTechApi with each subsequen request.  #### Redirecting to the ConsentAuthorisationApi Any response of the FinTechApi that redirects the PSU to the ConsentAuthorisationApi makes sure following happens: * that the exisitng SessionCookie is deleted, as there is no explicite login. * that a RedirectCookie is set, so the user can be authenticated again when sent back to the FinTechApi. * The url that sends the user back to the FinTechApi must carry a redirecState parameter that matches the corresponding redirect cookie.  While redirecting the user to the ConsentAuthorisationApi, there is no certainty upon how long the consent session will take. For this reason, it is better to set a separated RedirectSessionCookie that has a life set to the expected max dureation of the consent authorisation session.  #### Reloading the FinTechUI Reloading the FinTechUI, we will also loose the XSRF parameter that is used to validate the SessionCookie. This is why we set RedirectCookie (that this time has a very short life span). The url reloading the FinTechUI must carry a redirectState parameter that will be used to invoke the /afterReload endpoint of the FinTechApi. Thus leading to a new SessionCookie and corresponding XSRF parameter. 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { ErrorResponse } from '../model/errorResponse';
import { InlineResponse200 } from '../model/inlineResponse200';
import { LoginRequest } from '../model/loginRequest';
import { PsuMessage } from '../model/psuMessage';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class FinTechAuthorizationService {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }



    /**
     * Sent by FinTechUI to FinTechApi to load the proper session cookie after a redirect based UI reload.
     * Sent by FinTechUI to FinTechApi to load the proper session cookie after a redirect based UI reload. The FinTechUI will parse the resirectSession from the reloadUrl. 
     * @param redirectState XSRF parameter used to validate an RedirectCookie. This is generaly transported as a path parameter. 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public afterReloadGET(redirectState: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public afterReloadGET(redirectState: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public afterReloadGET(redirectState: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public afterReloadGET(redirectState: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (redirectState === null || redirectState === undefined) {
            throw new Error('Required parameter redirectState was null or undefined when calling afterReloadGET.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/v1/afterReload/${encodeURIComponent(String(redirectState))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Entry point when PSU is redirected back to the FinTechApi.
     * Entry point when PSU is redirected back to the FinTechApi by the ConsentAuthorisationApi. 
     * @param redirectState XSRF parameter used to validate an RedirectCookie. This is generaly transported as a path parameter. 
     * @param redirectId 
     * @param redirectCode 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public fromConsentOkGET(redirectState: string, redirectId: string, redirectCode: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public fromConsentOkGET(redirectState: string, redirectId: string, redirectCode: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public fromConsentOkGET(redirectState: string, redirectId: string, redirectCode: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public fromConsentOkGET(redirectState: string, redirectId: string, redirectCode: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (redirectState === null || redirectState === undefined) {
            throw new Error('Required parameter redirectState was null or undefined when calling fromConsentOkGET.');
        }
        if (redirectId === null || redirectId === undefined) {
            throw new Error('Required parameter redirectId was null or undefined when calling fromConsentOkGET.');
        }
        if (redirectCode === null || redirectCode === undefined) {
            throw new Error('Required parameter redirectCode was null or undefined when calling fromConsentOkGET.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (redirectCode !== undefined && redirectCode !== null) {
            queryParameters = queryParameters.set('redirectCode', <any>redirectCode);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/v1/${encodeURIComponent(String(redirectId))}/fromConsentOk/${encodeURIComponent(String(redirectState))}`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Identifies the PSU in the Realm of the FinTechApi.
     * Simple login interface used to establish a session between PSU and FinTech. Real application will delegate login to an oAuth2 Identity provider. 
     * @param xRequestID Unique ID that identifies this request through common workflow. Must be contained in HTTP Response as well. 
     * @param loginRequest Login request
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public loginPOST(xRequestID: string, loginRequest: LoginRequest, observe?: 'body', reportProgress?: boolean): Observable<InlineResponse200>;
    public loginPOST(xRequestID: string, loginRequest: LoginRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<InlineResponse200>>;
    public loginPOST(xRequestID: string, loginRequest: LoginRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<InlineResponse200>>;
    public loginPOST(xRequestID: string, loginRequest: LoginRequest, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (xRequestID === null || xRequestID === undefined) {
            throw new Error('Required parameter xRequestID was null or undefined when calling loginPOST.');
        }
        if (loginRequest === null || loginRequest === undefined) {
            throw new Error('Required parameter loginRequest was null or undefined when calling loginPOST.');
        }

        let headers = this.defaultHeaders;
        if (xRequestID !== undefined && xRequestID !== null) {
            headers = headers.set('X-Request-ID', String(xRequestID));
        }

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<InlineResponse200>(`${this.configuration.basePath}/v1/login`,
            loginRequest,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
