import { Injectable } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { ToastrService } from "ngx-toastr";
import { filter } from "rxjs/operators";

@Injectable()
export class PromptUpdateService {

  constructor(swUpdate: SwUpdate,
    public toastr: ToastrService) {
    swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(evt => {
            // let ask = prompt(JSON.stringify(evt));

			this.toastr.success('Aplicatia a fost actualizata.', 'Succes!', {  positionClass: 'toast-bottom-center' });
			setTimeout(() => {
				document.location.reload();
			}, 1500);
        });
  }

}
