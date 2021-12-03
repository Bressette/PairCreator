import { Component } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {PairGroup} from './pair';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private formBuilder: FormBuilder) {
    this.generatePairs();
  }

  title = 'PairCreator';
  pairs: PairGroup[] = [];
  pairString: string[] = [];

  formGroup = this.formBuilder.group({
    groupNames: ['Bryce, Ian, Matthew, Johnathan, Amy, Billy, Walter, Taylor'],
    groupSize: [2],
    incompatibleNames: [''],
    previousPairs: [''],
  });

  generatePairs(): void {
    this.pairs = [];
    this.pairString = [];
    let names: string[];
    names = this.formGroup.get('groupNames')?.value.split(',').map((result: string) => result.trim());
    if (this.formGroup.get('groupSize')?.value > names.length) {
      return alert('The group size must be less than the number of names');
    }
    while (names.length > 0) {
      for (let j = 0; j < this.formGroup.get('groupSize')?.value; j++) {
        if (this.pairs.length < j + 1) {
          this.pairs.push(new PairGroup());
        }
        const selectedIndex = Math.floor(Math.random() * names.length);
        this.pairs[j].names.push(names[selectedIndex]);
        names.splice(selectedIndex, 1);
      }
    }

    for (const pair of this.pairs) {
      console.log(pair.names.join(','));
      this.pairString.push(pair.names.join(', '));
    }
    console.log('The pairs object after generating the pairs: ' + JSON.stringify(this.pairs));
    console.log('The pairString object after parsing the string: ' + JSON.stringify(this.pairString));
  }

}
