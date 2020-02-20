import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AccountReferenceComponent} from "../account-reference-selector/account-reference.component";
import {Globals} from "../globals";

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent implements OnInit {

  @Input() form: FormGroup;

  accounts: AccountReferenceComponent[] = [];
  balances: AccountReferenceComponent[] = [];
  transactions: AccountReferenceComponent[] = [];


  allChecked = {checked: false};
  dedicatedChecked = {checked: false};
  allAccounts = new FormControl();

  constructor(private globals: Globals) {}

  ngOnInit() {
    this.form.addControl('aisConsent.access.availableAccounts', this.allAccounts);

    this.globals.userInfo.subscribe(it => {
      if (it.id === 'ais.allAccounts') {
        this.allChecked.checked = true;
        this.allAccounts.setValue(it.value);
      }

      if (it.id === 'ais.accounts') {
        this.dedicatedChecked.checked = true;
        this.addAccount().ibanValue = it.value;
      }

      if (it.id === 'ais.balances') {
        this.dedicatedChecked.checked = true;
        this.addBalance().ibanValue = it.value;
      }

      if (it.id === 'ais.transactions') {
        this.dedicatedChecked.checked = true;
        this.addTransaction().ibanValue = it.value;
      }
    });
  }

  addAccount(): AccountReferenceComponent {
    const ret = AccountReferenceComponent.buildWithId(this.accounts.length);
    this.accounts.push(ret);
    return ret;
  }

  removeAccount(acc: AccountReferenceComponent) {
    this.accounts = this.accounts.filter(it => it.elemId != acc.elemId);
    acc.remove();
  }

  addBalance(): AccountReferenceComponent {
    const ret = AccountReferenceComponent.buildWithId(this.balances.length);
    this.balances.push(ret);
    return ret;
  }

  removeBalance(acc: AccountReferenceComponent) {
    this.balances = this.balances.filter(it => it.elemId != acc.elemId);
    acc.remove();
  }

  addTransaction(): AccountReferenceComponent {
    const ret = AccountReferenceComponent.buildWithId(this.transactions.length);
    this.transactions.push(ret);
    return ret;
  }

  removeTransaction(acc: AccountReferenceComponent) {
    this.transactions = this.transactions.filter(it => it.elemId != acc.elemId);
    acc.remove();
  }
}
