import { Component, Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Coordinates } from '../app.component';

@Component({
  selector: 'app-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent implements OnChanges {
  playfield;

  @Input() random: Coordinates;
  @Input()
  set size(value: Coordinates) {
    this.playfield = this.createPlayField(value.x, value.y);
  }
  @Input() snake: Array<Coordinates>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.playfield.forEach(row => {
      row.forEach(col => {
        col.red = false;
      });
    });

    this.snake.forEach(x => {
      this.playfield[x.x][x.y].red = true;
    });

    if (this.random) {
      this.playfield[this.random.x][this.random.y].red = true;
    }
  }

  createPlayField(x, y) {
    const arr = [];

    for (let i = 0; i < x; i++) {
      arr.push([]);
      for (let z = 0; z < y; z++) {
        arr[i].push([{
          red: false
        }]);
      }
    }

    return arr;
  }
}

@Directive({
  selector: '[appSnakeCell]'
})
export class SnakeCellDirective {
  @Input() x: number;
  @Input() y: number;
  @Input() set snake(value: Array<Object>) {
    value.forEach(x => {

    });
  };
  @HostBinding('class.red') red = false;

}
