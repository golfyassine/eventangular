import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    <div *ngIf="visible" class="alert" [class]="'alert-' + type" [class.alert-dismissible]="dismissible">
      <i *ngIf="icon" [class]="'fa fa-' + getIcon()"></i>
      <span class="alert-message">{{ message }}</span>
      <button *ngIf="dismissible" type="button" class="close-btn" (click)="close()">
        <i class="fa fa-times"></i>
      </button>
    </div>
  `,
  styles: [`
    .alert {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .alert i {
      margin-right: 10px;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .alert-warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-message {
      flex: 1;
    }

    .alert-dismissible {
      padding-right: 40px;
      position: relative;
    }

    .close-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.3s;
    }

    .close-btn:hover {
      opacity: 1;
    }
  `],
  imports: [NgIf]
})
export class AlertComponent implements OnInit {
  @Input() message = '';
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';
  @Input() dismissible = true;
  @Input() icon = true;
  @Input() autoClose = false;
  @Input() autoCloseDelay = 5000;

  visible = true;

  ngOnInit(): void {
    if (this.autoClose) {
      setTimeout(() => this.close(), this.autoCloseDelay);
    }
  }

  close(): void {
    this.visible = false;
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return 'check-circle';
      case 'info': return 'info-circle';
      case 'warning': return 'exclamation-triangle';
      case 'danger': return 'exclamation-circle';
      default: return 'info-circle';
    }
  }
}
