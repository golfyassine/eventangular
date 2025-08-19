import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card" [class.hoverable]="hoverable">
      <div *ngIf="title" class="card-header">
        <h3 class="card-title">{{ title }}</h3>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footer" class="card-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      margin-bottom: 20px;
      overflow: hidden;
    }

    .hoverable {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .hoverable:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      padding: 15px 20px;
      border-bottom: 1px solid var(--border-color);
      background-color: var(--secondary-color);
    }

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      color: var(--primary-color);
    }

    .card-body {
      padding: 20px;
    }

    .card-footer {
      padding: 15px 20px;
      border-top: 1px solid var(--border-color);
      background-color: var(--secondary-color);
    }
  `],
  imports: [NgIf]
})
export class CardComponent {
  @Input() title?: string;
  @Input() footer = false;
  @Input() hoverable = true;
}
