import { Component, ViewChild, OnInit} from '@angular/core';
import {  FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignaturePadComponent, NgSignaturePadOptions } from '@almothafar/angular-signature-pad';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

// import custom validator to validate that password and confirm password fields match
import { CandidatesService } from 'app/shared/_services/candidates.service';
import { MustMatch } from '../../../shared/directives/must-match.validator';
import { Candidate, User } from 'app/shared/_models';
import { CandidateStatuses } from 'app/globals';
import * as addressInfo from 'app/shared/data/cities';
import { AuthService } from 'app/shared/auth/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})

export class RegisterPageComponent implements OnInit {
    addressInfo = addressInfo;
    registerFormSubmitted = false;
    registerForm: FormGroup;
    client: User;
    candidate: Candidate;
    @ViewChild('signature',{ static : false})   public signaturePad: SignaturePadComponent;
    signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
        minWidth: 0.5,
        maxWidth: 3,
        canvasWidth: 300,
        canvasHeight: 180,
        backgroundColor: 'transparent',

    };

    constructor(
        private authService: AuthService,
        private candidServ: CandidatesService,
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        public toastr: ToastrService,
        private router: Router) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            // firstName: ['www', Validators.required],
            // lastName: ['www', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            confirmPassword: ['', Validators.required]
        }, {
        validator: MustMatch('password', 'confirmPassword')
        });

    }

    get rf() {
        return this.registerForm.controls;
    }


    //  checking if candidate info is correct
    onSubmitRegister() {
        this.registerFormSubmitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        this.spinner.show();
        this.candidServ.getCandidate(this.registerForm.value.email).subscribe( candidate => {

            if(candidate.status == CandidateStatuses.Ready){
                this.candidate = candidate;
                this.client = new User();
                this.client.createFromCandidate(this.candidate);
                this.client.password = this.registerForm.value.password
                console.log(this.client);
            } else {
                Swal.fire('Neconfirmat!',`Participarea ta la <strong> Ziua Porților Deschise</strong> nu a fost confirmată. <br>
                <span class="text-muted font-small-3 mt-4 d-block">Dacă consideri că este o greseală te rugăm să ne contactezi.</span>`,'warning')
            }

            this.spinner.hide();

        }, err =>{
            Swal.fire('Adresă email negăsită!','Verifică din nou adresa email!<br> Asigură-te că este același pe care l-ai folosit pentru a te înregistra la <strong> Ziua Porților Deschise.</strong>','error')
            this.spinner.hide();
        })

    // this.router.navigate(['/pages/login']);
    }


    // candidate check passed registering client
    onFormSubmit(){
        if(!this.client.signature){
            this.toastr.error('Semnatura este obligatorie.', 'Eroare!', {  positionClass: 'toast-bottom-center' });
        } else {
            this.spinner.show();

            this.candidServ.createClient(this.client).subscribe(client => {
                this.toastr.success('Contul a fost creat cu success.', 'Succes!', {  positionClass: 'toast-bottom-center' });
                this.authService.signinUser(this.client.email, this.client.password)
                .subscribe((res) => {
                    this.spinner.hide();
                    this.router.navigate(['/dash']);
                },
                (err) => {
                    this.spinner.hide();
                    console.log('error: ' + err)
                });
            },err => {
                console.log(err);
            })
        }
    }

    cancelRegister(){
        this.candidate = null;
    }

    clearSignature(){
        this.signaturePad.clear();
        this.client.signature = '';
    }

    onInvoicedSwitch(event){
        if(false === event){
            this.client.invoicedFirstName = '';
            this.client.invoicedLastName = '';
        }
    }

    drawComplete() {
        this.client.signature = this.signaturePad.toDataURL();
    }
}
