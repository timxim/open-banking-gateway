import {Component, Input, OnInit} from '@angular/core';
import {DynamicFormControlBase, Target} from "../dynamic-form/dynamic-form-control-base";
import {ActivatedRoute} from "@angular/router";
import {Consts} from "../consts";

@Component({
  selector: 'app-parameters-input',
  templateUrl: './parameters-input.component.html',
  styleUrls: ['./parameters-input.component.css']
})
export class ParametersInputComponent implements OnInit {

  @Input() inputsAisConsent: DynamicFormControlBase<any>[] = [];
  @Input() inputsDynamic: DynamicFormControlBase<any>[] = [];
  submissionUri: string = Consts.API_V1_URL_BASE + 'consent/';

  constructor(private activatedRoute: ActivatedRoute) {  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.submissionUri = this.submissionUri + params['authorizationSessionId'] + '/embedded?redirectCode=' + params['redirectCode'];
        const data: DynamicFormControlBase<any>[] = JSON.parse(params['q'])
          .map(it => new DynamicFormControlBase(it.ctxCode, it.uiCode, it.message, it.target as Target));
        this.inputsAisConsent = data.filter(it => it.target === Target.AIS_CONSENT);
        this.inputsDynamic = data.filter(it => it.target === Target.CONTEXT);
      }
    );
  }
}
