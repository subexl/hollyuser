import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface ITemplateConfig
{
    layout: {
        variant: string;                   // options: Dark, Light & Transparent
        menuPosition: string;              // options: Side, Top (Note: Use 'Side' for Vertical Menu & 'Top' for Horizontal Menu )
        customizer: {
            hidden: boolean;               // options: true, false
        };
        navbar: {
          type: string;                     // options: Static & Fixed
        }
        sidebar: { //Options for Vertical Side menu
            collapsed: boolean;             // options: true, false
            size: string;                   // Options: 'sidebar-lg', 'sidebar-md', 'sidebar-sm'
            backgroundColor: string;        // Options: 'black', 'pomegranate', 'king-yna', 'ibiza-sunset', 'flickr', 'purple-bliss', 'man-of-steel', 'purple-love'

            /* If you want transparent layout add any of the following mentioned classes to backgroundColor of sidebar option :
              bg-glass-1, bg-glass-2, bg-glass-3, bg-glass-4, bg-hibiscus, bg-purple-pizzaz, bg-blue-lagoon, bg-electric-viloet, bg-protage, bg-tundora
            */
            backgroundImage: boolean;        // Options: true, false | Set true to show background image
            backgroundImageURL: string;
        }
    };
}


@Injectable({
  providedIn: "root"
})
export class ConfigService {
    savedConfig = localStorage.getItem('templateConf');
    public templateConf: ITemplateConfig ;
    templateConfSubject ;
    templateConf$;
    constructor() {
        this.templateConf = this.savedConfig ? JSON.parse(this.savedConfig) : this.setConfigValue();
        this.templateConfSubject = new BehaviorSubject<ITemplateConfig>(this.templateConf);
        this.templateConf$ = this.templateConfSubject.asObservable();

    }

  // Default configurations for Light layout. Please check *customizer.service.ts* for different colors and bg images options

    setConfigValue() {
        return this.templateConf = {
        layout: {
            variant: "Dark",
            menuPosition: "Side",
            customizer: {
            hidden: false
            },
            navbar: {
            type: 'Static'
            },
            sidebar: {
            collapsed: false,
            size: "sidebar-sm",
            backgroundColor: "black",
            backgroundImage: true,
            backgroundImageURL: "assets/img/sidebar-bg/03.jpg"
            }
        }
        };
    }


  applyTemplateConfigChange(tempConfig: ITemplateConfig) {
    this.templateConf = Object.assign(this.templateConf, tempConfig);
    this.templateConfSubject.next(this.templateConf);

    localStorage.setItem('templateConf',JSON.stringify(this.templateConf));

  }

}
