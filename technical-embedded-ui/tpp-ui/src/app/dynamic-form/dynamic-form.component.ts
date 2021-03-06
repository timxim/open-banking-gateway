import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlBase } from './dynamic-form-control-base';
import {DynamicFormFactory} from "./dynamic-form-factory";
import {HttpClient} from "@angular/common/http";
import {Helpers} from "../app.component";

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {

  @Input() controlTemplates: DynamicFormControlBase<any>[] = [];
  @Input() submissionUri: string;
  form: FormGroup;

  constructor(private client: HttpClient, private formFactory: DynamicFormFactory) {  }

  ngOnInit() {
    this.form = this.formFactory.toFormGroup(this.controlTemplates);
  }

  save() {
    const formObj = this.form.getRawValue();
    console.log(formObj)
    for (const propName in formObj) {
      if (formObj[propName] === null || formObj[propName] === undefined || formObj[propName].length === 0) {
        delete formObj[propName];
      }
    }

    this.client.post(
      this.submissionUri,
      {scaAuthenticationData: formObj}, // scaAuthenticationData is not really correct
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
}
