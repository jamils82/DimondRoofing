import { Component, Input, OnInit } from '@angular/core';
import { User } from '@spartacus/core';
import { Observable } from 'rxjs';
import { AccountDropdownStateService } from '../../services/account-dropdown-state.service';
import { UserAccountDetailServiceService } from '../../services/user-account-detail-service.service';

@Component({
  selector: 'app-welcome-text',
  templateUrl: './welcome-text.component.html',
  styleUrls: ['./welcome-text.component.scss']
})
export class WelcomeTextComponent implements OnInit {
  @Input() isDashboard?: boolean = false;
  @Input() welcomeNote?: string;
  navigationData: any = [];
  user$: Observable<User | undefined> = new Observable;
  constructor(
    private fiUserAccountDetailsService: UserAccountDetailServiceService,) { }

  ngOnInit(): void {
    if (this.isDashboard) {
      this.user$ = this.fiUserAccountDetailsService.getUserAccount();
    }
  }

}
