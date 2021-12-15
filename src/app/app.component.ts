import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {PairGroup} from './pair';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.generatePairs();
  }

  title = 'PairCreator';
  pairs: PairGroup[] = [];
  pairString: string[] = [];

  formGroup = this.formBuilder.group({
    groupNames: ['Bryce, Ian, Matthew, Johnathan, Amy, Billy, Walter, Taylor'],
    groupSize: [2],
    incompatibleNames: ['Test1, Test2, Test3\nTest4, Test5, Test6'],
    previousPairs: ['Test7, Test8, Test9, Test10\nTest10, Test11, Test12, Test13'],
  });

  queryParamClass = class PairQueryParam {
  names = '';
  incompatNames: string | string[] = '';
  prevPairs: string | string[] = '';
};

  ngOnInit(): void {
    this.route.queryParams.subscribe(result => {
      if (result.names) {
        this.formGroup.get('groupNames')?.setValue(result.names);
      }
      if (result.incompatNames) {
        const incompatibleNamesArray = [].concat(result.incompatNames);
        let incompatibleNamesString = '';
        for (let i = 0; i < incompatibleNamesArray.length; i++) {
          if (i !== 0) {
            incompatibleNamesString += `\n${incompatibleNamesArray[i]}`;
          }
          incompatibleNamesString += incompatibleNamesArray[i];
        }
        this.formGroup.get('incompatibleNames')?.setValue(incompatibleNamesString);
      }

      if (result.prevPairs) {
        const previousPairsArray = [].concat(result.prevPairs);
        let previousPairsString = '';
        for (let i = 0; i < previousPairsArray.length; i++) {
          if (i !== 0) {
            previousPairsString += `\n${previousPairsArray[i]}`;
          }
          else {
            previousPairsString += previousPairsArray[i];
          }
        }
        this.formGroup.get('previousPairs')?.setValue(previousPairsString);
      }

      if (result.groupSize) {
          const groupSizeNumber = parseInt(result.groupSize, 10);
          if (!isNaN(groupSizeNumber)) {
            this.formGroup.get('groupSize')?.setValue(result.groupSize);
          }
      }
      this.generatePairs();
    });
  }

  generatePairs(): void {
    this.pairs = [];
    this.pairString = [];
    // setting the value of names to the comma separated values in the groupNames Text Area
    let names: string[];
    names = this.formGroup.get('groupNames')?.value.split(',').map((result: string) => result.trim());

    // Setting the values of the incompatibleNames map based on the previous pairs and incompatible names

    const incompatibleNamesMap = new Map();
    const incompatibleNamesList: Array<Array<Array<string>>> = [];

    const incompatibleNamesFormValue = this.formGroup.get('incompatibleNames')?.value;
    if (incompatibleNamesFormValue?.length > 0) {
      const incompatibleNamesSplit = incompatibleNamesFormValue.split(/\r?\n/);
      incompatibleNamesList.push(incompatibleNamesFormValue.split(/\r?\n/).map((result: string) => {
        return result.split(',').map((trimString: string) => trimString.trim());
      }));
    }

    const previousPairsFormValue = this.formGroup.get('previousPairs')?.value;

    /*  incompatibleNamesList should be populated as follows - iterate over each sub array to populate the map
     *  [['Billy', 'Bob', 'Sally', 'Jim'], ['Jimmy', 'Bryce', 'Matthew', 'Brittany']]
     *
     *
     */

    if (previousPairsFormValue?.length > 0) {
      incompatibleNamesList.push(previousPairsFormValue.split(/\r?\n/).map((result: string) => {
        return result.split(',').map((trimString: string) => trimString.trim());
      }));
    }

    // iterates over the arrays of string arrays to populate a map that contains the people that a given person can't pair with
    for (const i of incompatibleNamesList) {
      // iterates over each string array updating the map for each person that appears in that string array
      for (const j of i) {
        for (const k of j) {
          const currentIncompatibleNames: string[] = [];
          j.map(value => value !== k ? currentIncompatibleNames.push(value) : value);
          if (incompatibleNamesMap.has(k)) {
            const existingIncompatibleList = incompatibleNamesMap.get(k);
            existingIncompatibleList.push(...currentIncompatibleNames);
            incompatibleNamesMap.set(k, existingIncompatibleList);
          }
          else {
            incompatibleNamesMap.set(k, currentIncompatibleNames);
          }
        }
      }
    }

    if (this.formGroup.get('groupSize')?.value > names.length) {
      return alert('The group size must be less than the number of names');
    }
    while (names.length > 0) {
      for (let j = 0; j < this.formGroup.get('groupSize')?.value; j++) {
        if (this.pairs.length < j + 1) {
          this.pairs.push(new PairGroup());
          const firstPairIndex = Math.floor(Math.random() * names.length);
          this.pairs[j].names.push(names[firstPairIndex]);
          names.splice(firstPairIndex, 1);
          continue;
        }
        const currentIncompatibleNames: string[] = incompatibleNamesMap.get(this.pairs[j].names[0]);
        let compatibleNames: string[];
        if (!currentIncompatibleNames) {
          compatibleNames = [...names];
        } else {
          compatibleNames = names.filter(s => !currentIncompatibleNames.includes(s));
        }
        const selectedIndex = Math.floor(Math.random() * compatibleNames.length);
        if (!compatibleNames[selectedIndex]) {
          this.pairString = [];
          this.pairs = [];
          this.generatePairs();
        }
        this.pairs[j].names.push(compatibleNames[selectedIndex]);
        names.splice(names.indexOf(compatibleNames[selectedIndex]), 1);
      }
    }

    for (const pair of this.pairs) {
      if (this.pairString.length < this.pairs.length) {
        this.pairString.push(pair.names.join(', '));
      }
    }
  }

}
