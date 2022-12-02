import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';

import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { AuthService } from "./shared/auth/auth.service";
import { AuthGuard } from "./shared/auth/auth-guard.service";
import { WINDOW_PROVIDERS } from './shared/_services/window.service';
import { JwtInterceptor } from "./shared/_helpers/jwt.interceptor";
import { BrowserModule } from "@angular/platform-browser";
import { ToastrModule } from "ngx-toastr";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    NgbModule,
    NgxSpinnerModule,
    NgxDatatableModule,
    UiSwitchModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        },
        defaultLanguage: 'ro',
    }),
    PerfectScrollbarModule,
    NgxDatatableModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    WINDOW_PROVIDERS
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
