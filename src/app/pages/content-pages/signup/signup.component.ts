import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatesService } from 'app/shared/_services/candidates.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import * as globals from 'app/globals';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    candidateForm: FormGroup;
    submitted = false;
    locationId = globals.DEFAULT_LOCATION;
    environment = environment;

    constructor(private candidServ: CandidatesService,
        private translate: TranslateService,
        private router: Router,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.candidateForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            lang: ['', [Validators.required]],
            locationId: [this.locationId],
        });


    }

    get f() {
        return this.candidateForm.controls;
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.candidateForm.invalid) {
          return;
        }

        this.candidServ.addCandidate(this.candidateForm.value).subscribe(candidate => {
            this.router.navigate(['/pages/signup-success']);
        },err => {
            console.log(err);
            if(1062 === err.error.exception.errno){
                this.translate.get(['signup.duplicateEmail','signup.refresh','signup.alerttitle','back','signup.reloaded']).subscribe(strings => {
                    console.log(strings);
                    Swal.fire({
                        confirmButtonText: '<i class="fa fa-refresh mr-2" aria-hidden="true"></i> ' + strings['signup.refresh'],
                        showDenyButton: true,
                        denyButtonText: `<i class="fa fa-undo mr-2" aria-hidden="true"></i>` + strings.back,
                        icon: 'error',
                        title: strings['signup.duplicateEmail'],
                        html: strings['signup.alerttitle'],
                    })
                    .then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            this.candidServ.resetCandidate(this.candidateForm.value.email).subscribe(candidate => {
                                Swal.fire(strings['signup.reloaded'], '', 'success')
                            })
                        }
                        this.router.navigate(['/pages/login']);
                    })
                })
            }
        })
    }

}
