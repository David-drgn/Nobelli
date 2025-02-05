import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StorageServiceService } from '../services/storage/storage-service.service';
import { HttpServiceService } from '../services/http/http-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Injectable({
  providedIn: 'root', // Garante que o serviço seja singleton
})
export class CanActiveGuard implements CanActivate {
  constructor(
    private storage: StorageServiceService,
    private dialog: MatDialog,
    private http: HttpServiceService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.http.POST('verifyToken').pipe(
      tap((res) => {
        if (!res) {
          this.openDialog(
            'Realize o login',
            'Por favor, realize o login para prosseguir'
          )
            .afterClosed()
            .subscribe(() => {
              this.router.navigate(['/']);
            });
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }

  openDialog(title: string, message: string) {
    return this.dialog.open(AlertComponent, {
      data: { message, title },
    });
  }
}
