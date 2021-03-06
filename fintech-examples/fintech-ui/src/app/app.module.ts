import { HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../environments/environment';
import { ApiModule, Configuration, ConfigurationParameters } from './api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareModule } from './common/share.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { GlobalErrorHandler } from './errorsHandler/global-errors-handler';
import { ErrorService } from './errorsHandler/error.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.FINTECH_API,
    withCredentials: true
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ShareModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    ApiModule.forRoot(apiConfigFactory)
  ],
  providers: [
    AuthGuard,
    ErrorService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
