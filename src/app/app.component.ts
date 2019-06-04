
import { Component } from '@angular/core';
import { fromEvent, interval, Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { filter, map, scan, startWith, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

export declare type directions = 'left' | 'right' | 'top' | 'down';
export interface Coordinates {
  x: number;
  y: number;
}

const playFieldSize: Coordinates = {
  x: 10,
  y: 10
};
const startCoordinates: Coordinates = {
  x: 0,
  y: 0
};
const startDirection: directions = 'right';
const startSnakeLength = 3;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  playfieldSize = playFieldSize;
  speed = new BehaviorSubject(1000);
  snake = [];
  lose = new Subject();

  randomStream = new BehaviorSubject(undefined);

  startGameSubject = new Subject();

  eventStream$ = fromEvent(document, 'keydown').pipe(
    filter((e: KeyboardEvent) => {
      return e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40;
    }),
    map(e => e.which),
    startWith(39)
  );

  snake2 = combineLatest(
    of(this.createSnake(startCoordinates, startSnakeLength, startDirection)),
    this.speed,
    this.startGameSubject
  ).pipe(
    switchMap(([snake, speed]) => interval(speed).pipe(map(_ => snake))),
    withLatestFrom(this.eventStream$),
    scan(([snakeAcc, directionAcc], [snake, direction]) => {

      console.log(snakeAcc, directionAcc, snake, direction);

      return [snake, direction];
    }),
    map(([snake, direction]) => {
      console.log(snake, direction);

      return snake;
    })
  );

  intervalStream$ =
    combineLatest(this.speed, this.startGameSubject.pipe(tap(_ => this.randomise())))
      .pipe(
        switchMap(([period]) => interval(period).pipe(takeUntil(this.lose))),
        withLatestFrom(this.eventStream$),
        map(([t, which]) => which),
        scan((acc, cur) => Math.abs(acc - cur) === 2 ? acc : cur)
      )
      .subscribe(which => {
        const lastCol = Object.assign({}, this.snake[this.snake.length - 1]);

        switch (which) {
          case 37:
            if (lastCol.x) {
              lastCol.x -= 1;
            } else {
              this.loseGame();
            }
            break;
          case 38:
            if (lastCol.y) {
              lastCol.y -= 1;
            } else {
              this.loseGame();
            }
            break;
          case 39:
            if (lastCol.x < this.playfieldSize.x) {
              lastCol.x += 1;
            } else {
              this.loseGame();
            }
            break;
          case 40:
            if (lastCol.y < this.playfieldSize.y) {
              lastCol.y += 1;
            } else {
              this.loseGame();
            }
            break;
        }

        this.snake.push(lastCol);
        this.snake = this.snake.slice();

        if (lastCol.x === this.randomStream.value.x && lastCol.y === this.randomStream.value.y ) {
          this.randomise();
        } else {
          this.snake.shift();
        }
      });

  constructor () {
    this.snake = this.createSnake(startCoordinates, startSnakeLength, startDirection);
  }

  createSnake(start: Coordinates, length: number, direction: directions) {
    const arr = [];

    for (let i = 0; i < length; i++) {
      let obj: Coordinates;

      if (!arr.length) {
        obj = {
          x: start.x,
          y: start.y
        };
      } else {
        obj = Object.assign({}, arr[arr.length - 1]);

        switch (direction) {
          case 'right':
            obj.x += 1;
            break;

          case 'down':
            obj.y += 1;
            break;
        }
      }

      arr.push(obj);
    }


    return arr;
  }

  loseGame() {
    this.lose.next();
    this.lose.complete();
    alert('You failed!');
  }

  startGame() {
    this.startGameSubject.next();
  }

  randomise() {
    const xses = {};
    const yses = {};
    let randomx;
    let randomy;

    this.snake.forEach(col => {
      xses[col.x] = col;
      yses[col.y] = col;
    });

    while (randomx === undefined || xses.hasOwnProperty(randomx)) {
      randomx = Math.floor(Math.random() * playFieldSize.x);
    }

    while (randomy === undefined || yses.hasOwnProperty(randomy)) {
      randomy = Math.floor(Math.random() * playFieldSize.y);
    }

    this.randomStream.next({
      x: randomx,
      y: randomy
    });

    this.setNewInterval();
  }

  setNewInterval() {
    const newValue = this.speed.value - 10;

    this.speed.next(newValue);
  }
}
