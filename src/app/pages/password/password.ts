import { Component } from '@angular/core';
import { AppNavbar } from "../../shared/navbar/navbar";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password',
  imports: [AppNavbar , RouterModule],
  templateUrl: './password.html',
  styleUrl: './password.css',
})
export class Password {

}
