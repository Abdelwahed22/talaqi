import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-homeafterregister',
  imports: [],
  templateUrl: './homeafterregister.html',
  styleUrl: './homeafterregister.css',
})
export class Homeafterregister {
currentYear = signal(new Date().getFullYear());
}
