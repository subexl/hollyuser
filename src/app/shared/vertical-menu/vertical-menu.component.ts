import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    ElementRef,
    AfterViewInit,
    ChangeDetectorRef,
    HostListener,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { customAnimations } from '../animations/custom-animations';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../_services/config.service';
import { Subscription } from 'rxjs';
import { LayoutService } from '../_services/layout.service';
import { AuthService } from '../auth/auth.service';
import { RouteInfo } from '../_models';

@Component({
    selector: 'app-sidebar',
    templateUrl: './vertical-menu.component.html',
    animations: customAnimations,
})
export class VerticalMenuComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('toggleIcon') toggleIcon: ElementRef;
    level: number = 0;
    logoUrl = 'assets/img/logo.png';
    public config: any = {};
    protected innerWidth: any;
    layoutSub: Subscription;
    configSub: Subscription;
    perfectScrollbarEnable = true;
    collapseSidebar = false;
    resizeTimeout;
    location: number;
    menuItems: RouteInfo[] = [];

    constructor(
        private authService: AuthService,
        public translate: TranslateService,
        private layoutService: LayoutService,
        private configService: ConfigService,
        private cdr: ChangeDetectorRef,
        private deviceService: DeviceDetectorService
    ) {
        this.config = this.configService.templateConf;
        this.innerWidth = window.innerWidth;
        this.isTouchDevice();
    }

    ngOnInit() {
        this.menuItems = this.authService.getUserMenu();
        this.location = this.authService.currentLocationId;
    }

    ngAfterViewInit() {
        this.configSub = this.configService.templateConf$.subscribe(
            (templateConf) => {
                if (templateConf) {
                    this.config = templateConf;
                }
                this.loadLayout();
                this.cdr.markForCheck();
            }
        );

        this.layoutSub = this.layoutService.overlaySidebarToggle$.subscribe(
            (collapse) => {
                if (this.config.layout.menuPosition === 'Side') {
                    this.collapseSidebar = collapse;
                }
            }
        );
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(
            (() => {
                this.innerWidth = event.target.innerWidth;
                this.loadLayout();
            }).bind(this),
            500
        );
    }

    loadLayout() {
        if (this.config.layout.sidebar.backgroundColor === 'white') {
            this.logoUrl = 'assets/img/logo-dark.png';
        } else {
            this.logoUrl = 'assets/img/logo.png';
        }

        if (this.config.layout.sidebar.collapsed) {
            this.collapseSidebar = true;
        } else {
            this.collapseSidebar = false;
        }
    }

    toggleSidebar() {
        let conf = this.config;
        conf.layout.sidebar.collapsed = !this.config.layout.sidebar.collapsed;
        this.configService.applyTemplateConfigChange({ layout: conf.layout });

        setTimeout(() => {
            this.fireRefreshEventOnWindow();
        }, 300);
    }

    fireRefreshEventOnWindow = function () {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('resize', true, false);
        window.dispatchEvent(evt);
    };

    CloseSidebar() {
        this.layoutService.toggleSidebarSmallScreen(false);
    }

    isTouchDevice() {
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();

        if (isMobile || isTablet) {
            this.perfectScrollbarEnable = false;
        } else {
            this.perfectScrollbarEnable = true;
        }
    }

    ngOnDestroy() {
        if (this.layoutSub) {
            this.layoutSub.unsubscribe();
        }
        if (this.configSub) {
            this.configSub.unsubscribe();
        }
    }
}
