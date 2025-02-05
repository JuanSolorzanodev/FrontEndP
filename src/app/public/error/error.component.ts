import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';
@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit{

  ngOnInit(): void {
    gsap.to('h1', { duration: 1, opacity: 1, y: 20, yoyo: true, ease: "power3.inOut" });
    this.cargarScript();
  }
  cargarScript() {
    const script = document.createElement('script');
    script.src = 'js/error.js';  // Ruta del archivo
    script.async = true;
    document.body.appendChild(script);
  }
}
