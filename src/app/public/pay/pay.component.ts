import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [ButtonModule,StepperModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent {

}
