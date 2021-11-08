import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { AuthInterceptor } from './interceptors/auth-interceptor';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { I18nModule } from './modules/i18n/i18n.module';
import { AppRoutingModule } from './modules/app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoggerModule } from 'ngx-logger';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageCropperModule } from 'ngx-image-cropper';


import { AppComponent } from './app.component';
import { AccountComponent } from './components/pages/account/account.component';
import { LandingComponent } from './components/pages/landing/landing.component';
import { GeneralComponent } from './components/pages/general/general.component';
import { LoginComponent } from './components/modals/login/login.component';
import { JoinComponent } from './components/modals/join/join.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { FooterComponent } from './components/navigation/footer/footer.component';
import { BannerComponent } from './components/navigation/banner/banner.component';
import { LeftNavigationComponent } from './components/navigation/left-navigation/left-navigation.component';
import { BodyComponent } from './components/pages/landing/body/body.component';
import { ModalFactoryComponent } from './components/modals/modalfactory.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { ImageCropperComponent } from './components/modals/image-cropper/image-cropper.component';
import { AdddelayComponent } from './components/modals/adddelay/adddelay.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    LandingComponent,
    GeneralComponent,
    ModalFactoryComponent,
    LoginComponent,
    JoinComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    LeftNavigationComponent,
    BodyComponent,
    DashboardComponent,
    ProfileComponent,
    ImageCropperComponent,
    AdddelayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    I18nModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    ReactiveFormsModule,
    ImageCropperModule,
    LoggerModule.forRoot({
      level:environment.logLevel
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GoogleLoginProvider)
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.FacebookLoginProvider)
          }
        ]
      } as SocialAuthServiceConfig,
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
