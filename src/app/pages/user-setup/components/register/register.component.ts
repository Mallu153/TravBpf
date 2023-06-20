import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import * as apiUrls from '../../constants/url.constants';
import * as UserModels from '../../models/user.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Register';
  registerForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  updateaccountregisterForm: any;
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private accountServices: UserService
  ) {
    this.titleService.setTitle('Register');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No  Id found ');
        }
      }
    });
  }
  initializeForm() {
    this.registerForm = this.fb.group({
      SNO: '',
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      EmailID: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      Supervisor: '',
      ValidFrom: '',
      ValidTo: '',
      Status: ['', [Validators.required]],
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onSubmitRegisterForm() {
    this.submitted = true;
    if (this.registerForm.valid) {
      const dataToSend = {
        UserName: this.registerForm.value.UserName,
        Password: this.registerForm.value.Password,
        EmailID: this.registerForm.value.EmailID,
        FirstName: this.registerForm.value.FirstName,
        LastName: this.registerForm.value.LastName,
        PhoneNumber: this.registerForm.value.PhoneNumber,
        Supervisor: this.registerForm.value.Supervisor,
        ValidFrom: this.registerForm.value.ValidFrom,
        ValidTo: this.registerForm.value.ValidTo,
        Status: this.registerForm.value.Status,
        organizationId: '1',
      };
      this.accountServices
        .CreateAccountregister(dataToSend, apiUrls.accountregister.createAccountregister)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          // console.log('result: ', res);
          this.submitted = false;
          this.registerForm.reset();
          this.registerForm.controls.Status.setValue('Active');
          this.toastr.success('Account Created Successfully...');
          //this.zone.run(() => this.router.navigateByUrl('/login'));
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditRegisterForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.registerForm.valid) {
      const dataToSend = {
        SNO: this.registerForm.value.SNO,
        UserName: this.registerForm.value.UserName,
        Password: this.registerForm.value.Password,
        EmailID: this.registerForm.value.EmailID,
        FirstName: this.registerForm.value.FirstName,
        LastName: this.registerForm.value.LastName,
        PhoneNumber: this.registerForm.value.PhoneNumber,
        Supervisor: this.registerForm.value.Supervisor,
        ValidFrom: this.registerForm.value.ValidFrom,
        ValidTo: this.registerForm.value.ValidTo,
        Status: this.registerForm.value.Status,
        organizationId: '1',
      };
      this.accountServices
        .updateAccountregister(dataToSend, apiUrls.accountregister.updateAccountregister)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          // console.log('result: ', res);
          /* this.submitted = false;
        this.registerForm.reset();
        this.registerForm.controls.Status.setValue('Active'); */
          this.toastr.success('Account Updated Successfully...');
          this.router.navigate(['/dashboard/account-setup/register-list']);
          //this.zone.run(() => this.router.navigateByUrl('/login'));
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  findById(id) {
    this.isEdit = true;
    this.accountServices
      .findAccountRegisterById(id, apiUrls.accountregister.findAccountregister)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        this.updateaccountregisterForm = res;
        if (this.updateaccountregisterForm) {
          this.pageTitle = 'Edit Register';
          this.titleService.setTitle('Edit Register');
          this.registerForm.patchValue({
            SNO: this.updateaccountregisterForm.SNO,
            UserName: this.updateaccountregisterForm.UserName,
            Password: this.updateaccountregisterForm.Password,
            EmailID: this.updateaccountregisterForm.EmailID,
            FirstName: this.updateaccountregisterForm.FirstName,
            LastName: this.updateaccountregisterForm.LastName,
            PhoneNumber: this.updateaccountregisterForm.PhoneNumber,
            Supervisor: this.updateaccountregisterForm.Supervisor,
            ValidFrom: this.updateaccountregisterForm.ValidFrom,
            ValidTo: this.updateaccountregisterForm.ValidTo,
            Status: this.updateaccountregisterForm.Status,
          });
          // tslint:disable-next-line: align
          this.isEdit = true;
        } else {
          this.router.navigate(['/dashboard/account-setup/register-list']);
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
