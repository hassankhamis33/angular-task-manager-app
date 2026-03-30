import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskManagerComponent } from './task-manager.component';

/**
 * Task Manager Feature Module
 * Lazy loadable module containing task management functionality
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskManagerComponent
  ]
})
export class TaskManagerModule { }
