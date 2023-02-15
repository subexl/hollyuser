import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CheckForUpdateService } from './shared/_services/check-for-update.service';
import { LogUpdateService } from './shared/_services/log-update.service';
import { PromptUpdateService } from './shared/_services/prompt-update.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    constructor(private router: Router,
        private promptUpdate: PromptUpdateService,
        private logUpdate: LogUpdateService,
        private updateCheck: CheckForUpdateService,
        private translate: TranslateService) {
        this.translate.setDefaultLang('ro');
    }

    ngOnInit() {
        this.subscription = this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => window.scrollTo(0, 0));
    }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }



}
