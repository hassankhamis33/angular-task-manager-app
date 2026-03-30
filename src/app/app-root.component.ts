import { Component } from '@angular/core';
import { TaskManagerComponent } from './features/task-manager/task-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskManagerComponent],
  template: '<app-task-manager></app-task-manager>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-task-manager';
}
