// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet],
//   template: `<router-outlet></router-outlet>`
// })
// export class App {}


// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppNavbar } from "./shared/navbar/navbar"; // مسار navbar اللي عملته
import { Footer } from './shared/footer/footer';
import { Reportaboutlosted } from './pages/reportaboutlosted/reportaboutlosted';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppNavbar,Footer,Reportaboutlosted,RouterModule],
  templateUrl: './app.html',
  styles: [`
    main { padding-top: 10px; }
  `]
})
export class App {}
