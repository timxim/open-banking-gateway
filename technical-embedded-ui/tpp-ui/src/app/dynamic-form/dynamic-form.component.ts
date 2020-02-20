import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlBase } from './dynamic-form-control-base';
import {DynamicFormFactory} from './dynamic-form-factory';
import {HttpClient} from '@angular/common/http';
import {Helpers} from '../app.component';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {

  @Input() aisControlTemplates: DynamicFormControlBase<any>[] = [];
  @Input() dynamicControlTemplates: DynamicFormControlBase<any>[] = [];
  @Input() submissionUri: string;
  formConsent: FormGroup;
  formDynamic: FormGroup;

  constructor(private client: HttpClient, private formFactory: DynamicFormFactory) {  }

  ngOnInit() {
    this.formConsent = this.formFactory.toFormGroup(this.aisControlTemplates);
    this.formDynamic = this.formFactory.toFormGroup(this.dynamicControlTemplates);
  }

  save() {
    const dynamicForm = this.formDynamic.getRawValue();
    this.cleanup(dynamicForm);

    const consentForm = this.formConsent.getRawValue();
    this.cleanup(consentForm);

    this.client.post(
      this.submissionUri,
      {
        consentAuth: {consent: consentForm},
        scaAuthenticationData: dynamicForm
      }, // scaAuthenticationData is not really correct
      {headers: {
        'X-Request-ID': Helpers.uuidv4(),
        'X-XSRF-TOKEN': Helpers.uuidv4(),
      }}
    ).subscribe(res => {
    }, error => {
      if (error.url.includes('redirToSandbox=')) {
        window.location.href = error.url.substr(error.url.indexOf('redirToSandbox=') + 'redirToSandbox='.length);
      } else {
        window.location.href = error.url;
      }
    });
  }

  private cleanup(form) {
    for (const propName in form) {
      if (form[propName] === null || form[propName] === undefined || form[propName].length === 0) {
        delete form[propName];
      }
    }
  }
}
