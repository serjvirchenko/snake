import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayFieldComponent, SnakeCellDirective } from './play-field/play-field.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayFieldComponent,
    SnakeCellDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
