// src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppNavbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AppNavbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}
