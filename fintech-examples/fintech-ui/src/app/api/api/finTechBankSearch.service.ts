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
import { InlineResponse2001 } from '../model/inlineResponse2001';
import { InlineResponse2002 } from '../model/inlineResponse2002';
import { PsuMessage } from '../model/psuMessage';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class FinTechBankSearchService {

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
     * Request the profile of the bank identified with id (bankId).
     * Request the profile of the bank identified with id (bankId).
     * @param xRequestID Unique ID that identifies this request through common workflow. Must be contained in HTTP Response as well. 
     * @param X_XSRF_TOKEN XSRF parameter used to validate a SessionCookie. 
     * @param bankId Identifier of the bank to be loaded.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bankProfileGET(xRequestID: string, X_XSRF_TOKEN: string, bankId: string, observe?: 'body', reportProgress?: boolean): Observable<InlineResponse2002>;
    public bankProfileGET(xRequestID: string, X_XSRF_TOKEN: string, bankId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<InlineResponse2002>>;
    public bankProfileGET(xRequestID: string, X_XSRF_TOKEN: string, bankId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<InlineResponse2002>>;
    public bankProfileGET(xRequestID: string, X_XSRF_TOKEN: string, bankId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (xRequestID === null || xRequestID === undefined) {
            throw new Error('Required parameter xRequestID was null or undefined when calling bankProfileGET.');
        }
        if (X_XSRF_TOKEN === null || X_XSRF_TOKEN === undefined) {
            throw new Error('Required parameter X_XSRF_TOKEN was null or undefined when calling bankProfileGET.');
        }
        if (bankId === null || bankId === undefined) {
            throw new Error('Required parameter bankId was null or undefined when calling bankProfileGET.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (bankId !== undefined && bankId !== null) {
            queryParameters = queryParameters.set('bankId', <any>bankId);
        }

        let headers = this.defaultHeaders;
        if (xRequestID !== undefined && xRequestID !== null) {
            headers = headers.set('X-Request-ID', String(xRequestID));
        }
        if (X_XSRF_TOKEN !== undefined && X_XSRF_TOKEN !== null) {
            headers = headers.set('X-XSRF-TOKEN', String(X_XSRF_TOKEN));
        }

        // authentication (sessionCookie) required
        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<InlineResponse2002>(`${this.configuration.basePath}/v1/search/bankProfile`,
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
     * Issues an incremental bank search request to the FinTechApi.
     * Issues an incremental bank search request to the FinTechApi.
     * @param xRequestID Unique ID that identifies this request through common workflow. Must be contained in HTTP Response as well. 
     * @param X_XSRF_TOKEN XSRF parameter used to validate a SessionCookie. 
     * @param keyword 
     * @param start 
     * @param max 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public bankSearchGET(xRequestID: string, X_XSRF_TOKEN: string, keyword: string, start?: number, max?: number, observe?: 'body', reportProgress?: boolean): Observable<InlineResponse2001>;
    public bankSearchGET(xRequestID: string, X_XSRF_TOKEN: string, keyword: string, start?: number, max?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<InlineResponse2001>>;
    public bankSearchGET(xRequestID: string, X_XSRF_TOKEN: string, keyword: string, start?: number, max?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<InlineResponse2001>>;
    public bankSearchGET(xRequestID: string, X_XSRF_TOKEN: string, keyword: string, start?: number, max?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (xRequestID === null || xRequestID === undefined) {
            throw new Error('Required parameter xRequestID was null or undefined when calling bankSearchGET.');
        }
        if (X_XSRF_TOKEN === null || X_XSRF_TOKEN === undefined) {
            throw new Error('Required parameter X_XSRF_TOKEN was null or undefined when calling bankSearchGET.');
        }
        if (keyword === null || keyword === undefined) {
            throw new Error('Required parameter keyword was null or undefined when calling bankSearchGET.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (keyword !== undefined && keyword !== null) {
            queryParameters = queryParameters.set('keyword', <any>keyword);
        }
        if (start !== undefined && start !== null) {
            queryParameters = queryParameters.set('start', <any>start);
        }
        if (max !== undefined && max !== null) {
            queryParameters = queryParameters.set('max', <any>max);
        }

        let headers = this.defaultHeaders;
        if (xRequestID !== undefined && xRequestID !== null) {
            headers = headers.set('X-Request-ID', String(xRequestID));
        }
        if (X_XSRF_TOKEN !== undefined && X_XSRF_TOKEN !== null) {
            headers = headers.set('X-XSRF-TOKEN', String(X_XSRF_TOKEN));
        }

        // authentication (sessionCookie) required
        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<InlineResponse2001>(`${this.configuration.basePath}/v1/search/bankSearch`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
