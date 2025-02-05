import { Component } from '@angular/core';
import { HttpServiceService } from '../services/http/http-service.service';
import { StorageServiceService } from '../services/storage/storage-service.service';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  view: boolean = false;

  email: string = '';
  password: string = '';
  check: boolean = false;

  load: boolean = false;

  constructor(
    private http: HttpServiceService,
    private storage: StorageServiceService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.storage.load.subscribe((loader) => {
      this.load = loader;
    });
    if (this.storage.token.getValue() != null) {
      this.storage.load.next(true);
      this.http.POST('verifyToken').subscribe(
        (res) => {
          this.storage.load.next(false);
          if (res.erro)
            this.openDialog(
              'Opss!',
              'Parece que o login realizado antes expirou, por favor, realize o login novamente'
            );
          else {
            this.openDialog(
              'Bem vinda!',
              'Parece que o login realizado antes ainda está registrado'
            );
            this.router.navigate(['/nobelli']);
          }
        },
        (erro) => {
          this.storage.load.next(false);
          this.openDialog(
            'Opss!',
            'Parece que o login realizado antes expirou, por favor, realize o login novamente'
          );
          console.error(erro);
        }
      );
    }
  }

  login() {
    if (this.email == '' || this.password == '') {
      this.openDialog(
        'Ops!',
        'Não se esqueça de preencher todos os campos!!',
        1
      );
    } else {
      this.storage.load.next(true);
      this.http
        .POST('login', {
          password: this.password,
          login: this.email,
          check: this.check,
        })
        .subscribe(
          (res) => {
            this.storage.load.next(false);
            if (res.erro) {
              this.openDialog(
                'Ops!',
                'Login ou senha estão incorretos, por favor, tente novamente!!',
                2
              );
            } else {
              this.storage.token.next(res.token);
              this.openDialog('Bem vinda!', 'Login realizado com sucesso!!', 2);
              this.router.navigate(['/nobelli']);
            }
          },
          (erro) => {
            this.openDialog(
              'Ops!',
              'Parece que algo deu errado, tente novamente!!',
              2
            );
            this.storage.load.next(false);
          }
        );
    }
  }

  openDialog(title: string, message: string, status: number = 0): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        title,
        message,
        status,
      },
    });
  }
}
