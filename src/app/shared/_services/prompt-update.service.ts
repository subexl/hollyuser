import { Injectable } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs/operators";

@Injectable()
export class PromptUpdateService {

  constructor(swUpdate: SwUpdate) {
    swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(evt => {
            let ask = prompt(JSON.stringify(evt));

            if (ask != null) {
                document.location.reload();
            }
        });
  }

}
