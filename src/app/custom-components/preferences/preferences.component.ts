import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CmsService, User } from '@spartacus/core' 
import { Observable, BehaviorSubject} from 'rxjs';
import { PreferencesService } from 'src/app/core/services/preferences.service';
import { UserAccountDetailServiceService } from 'src/app/shared/services/user-account-detail-service.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
 
  pageTitle: any;
  preferencesHeaderContent: any; 
  communicationPreferencesContent: any; 
  userDetails$: Observable<User | undefined> = new Observable;
  userDetailsObject:any = {};
  showWaitCursor = new BehaviorSubject<boolean>(true); 
  emailPreferencesContent: any;
  preferencesForm:FormGroup;
  subscribedEmail!:any;
  subscribed:boolean;
  showToast: boolean = false;
  isActive: boolean = false;
  errorInd$ = new BehaviorSubject<boolean>(false);
  infoMessage: string = '';
  isUserDetailsClicked:boolean=false;
  isCommPreferencesClicked:boolean=false;
  displayedRoles : any = [];
  constructor(
      public cmsService: CmsService, 
      private fiUserAccountDetailsService: UserAccountDetailServiceService,
      private formbuilder:FormBuilder,
      private preferenceService:PreferencesService,
      public cd: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    if (localStorage.getItem('preferences') != 'true') {
      this.isUserDetailsClicked = true;
    } else {
      this.isCommPreferencesClicked = true;
    }

    
    // function to get page title
    this.cmsService.getCurrentPage().subscribe((pagadata: any) => {
      this.pageTitle = pagadata.title; 
    })

    //get the user details
    this.userDetails$ = this.fiUserAccountDetailsService.getUserAccount();
    this.userDetails$.subscribe((data: any) => {
       this.userDetailsObject = data;
       this.showWaitCursor.next(false);
    })
    this.preferenceService.GetCurrent().subscribe((data: any) => {
      this.displayedRoles = data?.displayRoles;
      this.showWaitCursor.next(false);
   })
    this.preferencesForm = this.formbuilder.group({
      subscribedEmail: [
        this.userDetailsObject?.userPreferences?.subscribedEmail || this.userDetailsObject?.email, 
        [ Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      subscribed:[ 
        this.userDetailsObject?.userPreferences?.subscribed || false, 
        Validators.required]
    })

    // function to get the Preferences Header Content 
    this.cmsService.getComponentData('PreferencesHeaderContentComponent').subscribe((data: any) => {
      if (data) {
        this.preferencesHeaderContent = data?.content;
        this.showWaitCursor.next(false)
      }
    })

    // function to get the Communication Preferences Content 
    this.cmsService.getComponentData('CommunicationPreferencesContent').subscribe((data: any) => {
      if (data) {
        this.communicationPreferencesContent = data?.content;
        this.showWaitCursor.next(false)
      }
    })
   // function to get the Preferred Email address tooltip content 
   this.cmsService.getComponentData('EmailPreferencesToolTip').subscribe((data: any) => {
    if (data) {
      this.emailPreferencesContent = data?.content;
      this.showWaitCursor.next(false);
    }
  })
  }
  get formValid() {
    return this.preferencesForm.controls;
  }
  changeSubscribe(event:any) {
    if(event.target.value=='true'){
      this.subscribed=event.target.value;
      this.preferencesForm.value.subscribed=true;
    } else{
      this.preferencesForm.value.subscribed=false;
    }
  }
  onSubmit() {
      this.showToast = true;
      setTimeout(() => {
        this.showToast=false;
      }, 2000);
      this.preferenceService.sendPreferencesEmail(this.preferencesForm.value).subscribe((data)=>{
      },
      (error) => {
        this.errorInd$.next(true);
        this.infoMessage = error?.error?.errors[0]?.message;
        this.cd.markForCheck();
      })
    }
    onReset(){
      localStorage.setItem('preferences','true')
      window.location.reload();
      
    }
    onTabClick(data: any) {
      this.isUserDetailsClicked = this.isCommPreferencesClicked  = false;
      if (data == 'userdetails') {
        this.isUserDetailsClicked = true;
        localStorage.removeItem('preferences');
      } else if (data == 'commpreferences') {
        this.isCommPreferencesClicked = true;
      }
      this.cd.markForCheck();
    }
  closeToast() {
    this.showToast = false;
    return;
  }
  ngOnDestroy(): void {
    localStorage.removeItem('preferences');
  }
}