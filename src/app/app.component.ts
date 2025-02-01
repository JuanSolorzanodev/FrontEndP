import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ConfirmDialogModule,
   ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FrontEndPB';
  constructor() {}

  ngOnInit(): void {
    
  }
}
