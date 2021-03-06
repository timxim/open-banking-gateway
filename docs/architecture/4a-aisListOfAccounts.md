# List Of Accounts
General terms defined in the [dictionary](dictionary.md)

## Definition
Request the list of bank accounts associated with this PSU's online banking account at the target ASPSP. 

If there is any reference to an existing account information consent (AisConsent) stored in the database of the TPP, the TPP will use this consent reference to forward the service request to the OpenBanking interface of the ASPSP.

If there is no such reference in the database of the TPP, the TPP will respond the FinTech to redirect the PSU to the ConsentAuthorizationApi of the TPP.

In order to uniquely identify the requesting PSU, the TPP uses a unique reference made out of:
- the fintechId : the unique identifier of this FinTech in the realm of the TPP. This parameter is read from the [FinTechContext](dictionary.md#FinTechContext) transported as jwt-Token in the Authorization header of each FinTech request to the TPP.
- the psu-id@fintech : the unique identifier of the PSU in the realm of the FinTech.  This parameter is transported in the HttpHeader named: Fintech-User-ID

## Diagram
![Session diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/adorsys/open-banking-gateway/develop/docs/architecture/diagrams/useCases/4a-aisListOfAccounts.puml&fmt=svg&vvv=1&sanitize=true)  

## Use Cases
### LoA-010 FinTechUI.displayBankServices
The result of a bank selection is that the FinTechUI displays the [BankProfile](dictionary.md#BankProfile) to the PSU. The bank profile contains the list of services offered by the selected bank. For account information, this list generally contains only the first service "listOfAccounts" as all other account information services rely on the target account selected and identified by account-id. 

### LoA-020 : FinTechUI.selectService(listOfAccounts)
Once selected by the PSU, the FinTechUI forwards the service selected to the FinTechApi. In this case "listOfAccounts". The selection might be accompanied with some service specifications. For listOfAccounts, the option withBalance can be added to indicate that the balance has to be returned as well.

### <a name="LoA-030"></a>LoA-030 : FinTechApi.listOfAccounts
Call specification: listOfAccounts[SessionCookie,X-XSRF-TOKEN](withBalance)<p:bank-id>.
The FinTechUI issues a listOfAccounts request to the FinTechAPI with:
- __[SessionCookie and X-XSRF-TOKEN](dictionary.md#SessionCookie):__ The SessionCookie used to maintain association between FinTechUI and FinTechApi. It holds a session identifier. A corresponding XSRF-TOKEN is sent back and forth though the header and used to authenticate the SessionCookie.
- __The bank-id:__ passed as a query parameter and referencing the given [BankProfile](dictionary.md#BankProfile) that contains meta information associated with the selected Bank.
- __withBalance:__ optional, instruct the TPP to request balances associated with each account.
- __X-Request-ID:__ unique identifier that identifies this request throughout the entire processing chain. Shall be contained in HTTP Response as well.

### LoA-031 : FinTechApi.checkAuthorization
Call specification: : checkAuthorization(SessionCookie,\nX-XSRF-TOKEN):psu-id@fintech
Before proceeding with the request, the FinTechApi must validate the request for it authenticity and extract a unique identifier of the PSU in the world of the FinTech (psu-id@fintech). This validation also include the matching of the used cookie against the provided XSRF-Token.

### <a name="LoA-032"></a>LoA-032 : FinTechApi.userAgentContext
Parses the HTTP request and extract information associated with the user agent (see [UserAgentContext](dictionary.md#UserAgentContext)).
The __[UserAgentContext](dictionary.md#UserAgentContext)__ describes details associated with the user agent of the PSU. Generally not visible in the API as they are automatically provided by the user agent. The purpose is to transfer context specific information on both current Request and PsuUserAgent. Those information might later be required by the ASPSP like. Below is a non exhaustive list of UserAgent specific context information:
  * IP-Address,
  * IP-Port,
  * Accept,
  * Accept-Charset,
  * Accept-Encoding,
  * Accept-Language,
  * Device-ID,
  * User-Agent,
  * PSU-Geo-Location,
  * Http-Method.

### <a name="LoA-033"></a>LoA-033 : FinTechApi.buildUrlTemplates
Builds URL templates used to redirect control to the FinTechUI application. Generate a state parameter that will be used to protect the redirect process and add it as a query parameter to the built Fintech-Redirect-URL templates that are added to the request. The templates have the form __Fintech-Redirect-URL-[OK|NOK]<p:$AUTH-ID,q:state>__. Both the OK-URL and the NOK-URL are used to redirect control to the FinTechUI application from the TPP consent authorization interface (ConsentAuthorizationApi), as we set a RedirectCookie in the FinTechUI before redirecting the PSU to the ConsentAuthorizationApi. This RedirectCookie must be transported back to the FinTechApi with the redirect call back to the FinTech. 
  - In order to distinguish redirect cookie associated with different authorization flows, we scope the Fintech-Redirect-URL with a dynamic path parameter "$AUTH-ID". This must be set as part of the cookie path of the RedirectCookie returned to the FinTechUI.
  - In order to protect the Fintech-Redirect-URL against XSRF, we use the state parameter. This state parameter is defined at initialization of the request, and added as a query parameter to the Fintech-Redirect-URL.

### LoA-034 : FinTechApi.loadServiceSession
Uses the given psu-id and service type to load a corresponding service session if the FinTech judges the request of the PSU is the repetition of an existing service request.

### LoA-040 : TppBankingApi.listOfAccounts
Forwards the PSU request to TPP with following associated context informations:

- __Authorization:[FinTechContext](dictionary.md#FinTechContext): __ contains static identification information associated with the FinTech.
- __Fintech-User-ID: psu-id@fintech:__ the unique identifier of the PSU in the realm of the FinTech
- __Service-Session-ID:__ a unique identifier of the service request. This is returned by the TPP as a response to the first HTTP-Request associated with this service request.
- __Fintech-Redirect-URL-[OK|NOK]<p:auth-id,q:state>:__ these are URL used to redirect control to the FinTechUI application. See [LoA-033](4a-aisListOfAccounts.md#LoA-033).
- __UserAgentContext:__  See [LoA-032](4a-aisListOfAccounts.md#LoA-032).
- __Bank-ID: __ See [LoA-030](4a-aisListOfAccounts.md#LoA-030).
- __withBalance: __ See [LoA-030](4a-aisListOfAccounts.md#LoA-030).
- __X-Request-ID:__ See [LoA-030](4a-aisListOfAccounts.md#LoA-030).

### LoA-041 TppBankingApi.checkAuthorization
verifies the authenticity of the Authorization header "FinTechContext". Returns the extracted fintechId.

### LoA-042 TppBankingApi.serviceSpec
Put service parameter in a serviceSpec map for further processing.

### LoA-043 TppBankingApi.serviceContext
Put all objects associated with the call into a generic ServiceContext object.

### <a name="LoA-050"></a>LoA-050 BankingProtocolFacade.service
Forwards the call to the BankingProtocolFacade.

### LoA-051, -052 BankingProtocolFacade.selectBankingProtocol
- If the serviceSessionId exists, selects the BankingProtocol based on the given serviceSessionId.
- If the is the very first request, there is no serviceSessionId and the TppBankingApi selects the BankingProtocol based on the given: BankId and ServiceType (in this case "listOfAccounts")

### <a name="LoA-060"></a>LoA-060 : BankingProtocol.service
The [BankingProtocol](dictionary.md#BankingProtocol) associated with the given BankProfile decides on how to proceed with the request after loading and analyzing an eventually stored TppConsentSession.

### LoA-061 : BankingProtocol.define
This step maps service parameter to be used in further processing to variable names for beter readability in subsequent calls.

### LoA-062 .. -064  : BankingProtocol.handelServiceSession
If there is an existing serviceSessionId, it will be introspected to extract the id (bpServiceSessionID) and the key (bpServiceSessionKey) used to read and decrypt the persistent service session. The existing service session will be loaded.
If the is no existing service session, a new one will be instantiated, returning the newly persistet ServiceSession and the corresponding encryption key.

Note that all information associated with the service call are stored encrypted in the service session. The returned serviceSessionKey that can be used to decrypt the serviceSession.

### LoA-065 : BankingProtocol.externalId
Creates an external serviceSessionId based on the internal bpServiceSessionId and bpServiceSessionKey.

### LoA-066 : BankingProtocol.findMatchingConsent
use information provided to find a consent matching the service request.

### LoA-067 : BankingProtocol.updateServiceSession
Finaly updates the persistent service session with all prepared information.

### <a name="LoA-070"></a>LoA-070 .. -073 : No Suitable Consent Present: Create an Authorization Session
If there is no suitable consent available, the BankingProtocol updates the ServiceSession with a new authorization session identified by an auth-id (unique in the scope of the user/serviceSession).
- __The auth-id:__ is an identifier of the authorization instance in the context of this PSU. It can be a short alphanumeric string like "asrfvs" used to isolate parallel active authorization sessions from each order. 
- In __LoA-071 mapFinTechRedirectUrl__ this auth-id will be used by the FinTech to set the path of the corresponding RedirectSession and also used to fill the Fintech-Redirect-URL-[OK|NOK]<p:$AUTH-ID,q:state>.  
- __The redirectCode__ generated contains the serviceSessionID and the auth-id. The redirectCode is used by the ConsentAuthorizationApi of the TPP to access the service record.
- __The tppConsentEntryPoint__ is the static entry point of the nConsentAuthorisationApi extended with the query parameter redirectCode.

### LoA-074, LoA-075: Initiate Redirect
By returning the BankingProtocolResponse<RedirectToTpp>(authId,serviceSessionID,tppConsentEntryPoint,redirectExp), the BankingProtocol instructs the BankingProtocolFacade, and the TppBankingApi to initiate a redirect of the PSU to the ConsentAuthorizationApi.

### <a name="LoA-076"></a>LoA-076 TppBankingApi:303_SeeOther
The TppBankingApi turns the BankingProtocolResponse into a 303_SeeOther(authId,serviceSessionID,\ntppConsentEntryPoint,redirectExp).

### <a name="LoA-077"></a>LoA-077 FinTechApi.storeServiceSessionId
Before return control to the FinTechUI, the FinTechApi stores the returned serviceSessionID for future references.

### <a name="LoA-078"></a>LoA-078 FinTechApi.expireSessionCookie(SessionCookie)
Upon redirecting the PSU user agent to the ConsentAuthorizationApi, the regular session between the FinTechUI and the FinTechApi has to be removed in order to avoid unwanted access to the FinTechApi. Even though this is not mandatory as the SessionCookie is protected by an X-XSRF-TOKEN, it is still advisable to do this as the X-XSRF-TOKEN is eventually accessible to javascript code running in the UserAgent.

### <a name="LoA-079"></a>LoA-079 FinTechApi.createRedirectCookie
- __Purpose:__ The RedirectCookie is used make sure that the UserAgent that started a redirect flow is the same as the one the terminated that redirect flow. This is essential to assume that the PSU physically using this user agent is the same as the one that accessed the authorization interfaces of the (TPP resp. ASPSP).
- __The RedirectCookie:__ is therefore set by the origin of the redirection (FinTech) and must be transported to the FinTechApi when control is sent back to the FinTechUI.
- __Expiration:__ This RedirectCookie shall be set for the max time we think the PSU needs to complete authorization of the corresponding consent. Therefore the expiration of this RedirectCookie generally has a longer life span than the expiration of a regular SessionCookie. 
- __CookiePath (auth-id):__ This RedirectCookie must be bound to the "$AUTH-ID" path of the Fintech-Redirect-URLs (defined as Fintech-Redirect-URL-[OK|NOK]<p:$AUTH-ID,q:state>). This way, it does no need to be transported to the FinTechApi with any other request. 
- __XSRF Protection (state):__ This RedirectCookie is also protected by a "state" query parameter that is available to the Fintech-Redirect-URLs.
- __User Session__: Generally processing a successful redirect is equivalent to a successful re-establishment of the user session. Meaning that FinTechApi can set a new SessionCookie to maintain the session with the PSU without a new explicit login of the PSU.

### <a name="LoA-080"></a>LoA-080 : FinTechApi redirects userAgent to the ConsentAuthorisationApi
The service response carries a response code 302 instructing the FinTechUI to redirect the PsuUserDevice to the ConsentAuthorisationApi, with following information:
- redirectCode : attached as a query parameter
- SessionCookie : for deletion
- RedirectCookie : with the expected duration of the consent authorization.

### <a name="LoA-090"></a>LoA-090 Suitable Consent Present
If there is a suitable consent reference in the database of the TPP, this will be loaded and used to forward request to the ASPSP.

### <a name="LoA-091"></a>LoA-091 : Forward Service Request to ASPSP
Service request is forwarded to the [AspspBankingApi](dictionary.md#AspspBankingApi) together with a reference to an AisConsent. The Associated [TppContext](dictionary.md#TppContext) contains TPP identifying information.

### LoA-092 .. LoA-95 : Returned Service Response if sent and displayed to the PSU.
The returned ListOfAccountsResponse is wrapped into a BankingProtocolResponse<ListOfAccounts> that will travel through the call chain back to the FinTechApi.

### LoA-096 FinTechApi.storeServiceSessionId
The FinTechApi will first store the service session for future reference.

### LoA-096 FinTechApi:200_Accounts
The FinTechApi returns the payload to the FinTechUI together with a new SessionCookie. 
