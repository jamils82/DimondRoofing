import { NgModule } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [],
  imports: [
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0Client_id, 
      redirect_uri: environment.UIsiteURl
    })
  ],
  exports: [
    AuthModule
  ]
})
export class Auth0ModuleConfigModule { }
