import { Component } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private formBuilder: FormBuilder) {}

  title = 'PairCreator';
  groupSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  formGroup = this.formBuilder.group({
    groupNames: ['Test, Test, Test, Test, Test, Test, Test, Test'],
    groupSize: [4],
    incompatibleNames: [''],
    previousPairs: [''],
  });

}
