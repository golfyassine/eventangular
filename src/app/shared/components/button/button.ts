import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="'btn btn-' + variant + (block ? ' btn-block' : '') + (disabled ? ' disabled' : '')"
      (click)="onClick.emit($event)">
      <i *ngIf="icon && !loading" [class]="'fa fa-' + icon"></i>
      <i *ngIf="loading" class="fa fa-spinner fa-spin"></i>
      <span *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-primary:hover:not(.disabled) {
      background-color: var(--primary-hover);
    }

    .btn-secondary {
      background-color: var(--secondary-color);
      color: var(--text-color);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover:not(.disabled) {
      background-color: #e9ecef;
    }

    .btn-success {
      background-color: var(--success-color);
      color: white;
    }

    .btn-success:hover:not(.disabled) {
      background-color: #218838;
    }

    .btn-danger {
      background-color: var(--error-color);
      color: white;
    }

    .btn-danger:hover:not(.disabled) {
      background-color: #c82333;
    }

    .btn-block {
      width: 100%;
      display: block;
    }

    .disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
  `],
  imports: [NgIf]
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
