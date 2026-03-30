import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskManagerModule } from './features/task-manager/task-manager.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskManagerModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-task-manager';
}
