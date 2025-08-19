import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class PermissionsDirective implements OnInit {
  @Input('appHasPermission') permission: string | string[] = '';
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const permissions = Array.isArray(this.permission) ? this.permission : [this.permission];
    const userPerms = this.authService.getUserPermissions();

    if (permissions.some(p => userPerms.includes(p))) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
