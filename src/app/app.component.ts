
import { Component, ElementRef, HostBinding, HostListener, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { filter, map, take, scan, subscribeOn, tap, 
         takeLast, takeWhile, reduce, switchMap } from 'rxjs/operators';
import { of, from, Observable, fromEvent, 
         range, timer, Subject, BehaviorSubject,
         ReplaySubject } from 'rxjs';

// @ViewChild
// @HostBinding
// @HostListener

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RxJS-test';

  // SHOW RXJS  

  peoplesButtonDisabled: boolean = false;
  displayText1: string = ""

  people = [
    {name: 'Rostyslav', age: 41},
    {name: 'Elena', age: 40},
    {name: 'Vika', age: 21},
    {name: 'Ivan', age: 17},
    {name: 'Igor', age: 14},
    {name: 'Lisa', age: 12}
  ];
  res = [];

  peopleButtonClick() {
    this.peoplesButtonDisabled = true;

    interval(1000)
      .pipe(
        take(this.people.length),
        filter(index => this.people[index].age >= 18),
        map(index => this.people[index].name),
        scan((acc, value) => acc + ' ' + value)
      )
      .subscribe(subscribeResult => {
        this.displayText1 = subscribeResult;
      }, 
      error => console.log('error: ', error), // error
      () => this.peoplesButtonDisabled = false); // complete
  }

  timerSubscribeClick() {
    timer(2500).subscribe(v => { this.displayText1='' })
    this.displayText1 = 'Check your consol please...';
    let sub = interval(500).subscribe(v => console.log(v))
    setTimeout(() => {
      sub.unsubscribe(),
      this.displayText1 = ''}, 4000
    )
  }

  rangeClick() {
    this.displayText1 = 'Check your consol please...';
    range(42, 10).subscribe(v => console.log(v));
  }

  // STREAM

  stream$ = of(1, 2, 3, 4);
  displayText2: string = ""

  streamOf() {
    this.displayText2 = 'Check your consol please...';
    this.stream$.subscribe(val => {
      console.log('Value: ', val);
    })
  }

  arr$ = from([1, 2, 3, 4]);

  streamFrom1() {
    this.displayText2 = 'Check your consol please...';
    this.arr$.subscribe(val => console.log(val))
  }

  streamFrom2() {
    this.displayText2 = 'Check your consol please...';
    let arr$ = from([1, 2, 3, 4]).pipe(
        scan((acc, v) => acc.concat(v), [0]));
    arr$.subscribe(val => console.log(val));    
  }

  // OBSERVABLE

  displayText3: string = ""
  streamObservable$ = new Observable(observer => {
    observer.next('First value')

    setTimeout(() => observer.next('After 1000 ms'), 1000);
    setTimeout(() => observer.complete(), 1500);
    setTimeout(() => observer.error('Something went wrong'), 2000);
    setTimeout(() => observer.next('After 3000 ms'), 3000);
  });

  streamObserv1() {
    this.displayText3 = 'Check your consol please...';
    this.streamObservable$.subscribe( 
      val => console.log('Val: ', val),
      error => console.log('err: ', error),
      () => console.log('is complete!')
    )
  }

  streamObserv2() {
    this.displayText3 = 'Check your consol please...';
    this.streamObservable$.subscribe({
      next(val) {
        console.log(val);
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('complete');
      }
    })
  }
  
  streamObserv3() {
    this.streamObservable$.subscribe({
      next(val) {
        console.log(val);
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('complete');
      }
    })
  }

  onMouseMove($e: any) {
    of($e)
      .pipe(
        map(e => ({
          x: e.offsetX,
          y: e.offsetY
        }))
      )
      .subscribe(pos => {
        console.log(pos);
      })
  }

  // SUBJECT

  displayText4 = '';

  subjectClick1() {
  this.displayText4 = 'Check your consol please...';
  console.log('Subject:')
  let stream1$ = new Subject();

  stream1$.subscribe(v => console.log('Value: ', v));

  stream1$.next('Hello');
  stream1$.next('Rx');
  stream1$.next('JS');

  console.log('Behavior subject:')

  let stream2$ = new BehaviorSubject('First!');

  stream2$.next('Hello');
  stream2$.next('Rx');
  stream2$.next('JS');

  stream2$.subscribe(v => console.log('Value: ', v));

  console.log('Replay subject:');

  let stream3$ = new ReplaySubject(2);

  stream3$.next('Hello');
  stream3$.next('Rx');
  stream3$.next('JS');

  stream3$.subscribe(v => console.log('Value: ', v));
  }

  intervalMap() {
    this.displayText4 = 'Check your consol please...';
    this.stream$ = interval(1000)
      .pipe(
        tap(v => console.log('Tap: ', v)),
        map(v => v * 3),
        filter((v: any) => v % 2 === 0),
        take(5)
      );
      
    this.stream$.subscribe({
      next: v => console.log('Next: ', v),
      complete: () => {
        console.log('Complete (5results - take5)');
        this.displayText4 = ''; }
    })  
  }

  takeLast() {
    this.displayText4 = 'Check your consol please...';
    this.stream$ = interval(1000)
      .pipe(
        tap(v => console.log('Tap: ', v)),
        take(10),
        takeLast(5),
        // takeWhile(v => v < 7)
      );
      
    this.stream$.subscribe({
      next: v => console.log('Next: ', v),
      complete: () => { console.log('Complete)'),
      this.displayText4 = ''; }
    })  
  }

  // SCAN REDUCE switchMap

  displayText5="";

  scanReduceClick() {
    this.displayText5 = 'Check your consol please...';
    this.stream$ = interval(1000)
    .pipe(
      take(10),
      // scan((acc, v: any) => acc + v, 0)
      reduce((acc, v: any) => acc + v, 0)
    );
    
    this.stream$.subscribe({
    next: v => console.log('Next: ', v),
    complete: () => { console.log('Complete)'),
    this.displayText5 = ''; }
    })  
  }

  fromEventClick() {
    this.displayText5 = 'Check your consol please...';

    fromEvent(document, 'click')
      .pipe(
        switchMap(event => {
          return interval(1000)
            .pipe(
              tap(v => console.log('Tap: ', v)),
              take(5),
              reduce((acc, v: any) => acc + v, 0)
            )
        })
      )  
      .subscribe({
          next: v => console.log('Next: ', v),
          complete: () => { console.log('Complete)'),
          this.displayText5 = ''; }

      })
  }
 }
