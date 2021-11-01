import { Component, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor (
    private title: Title,
    private meta: Meta,
    private renderer: Renderer2,
    private authService: AuthenticationService
  ){}

  ngOnInit() {
    this.title.setTitle('Trein te laat - Kaart het hier aan');
    this.meta.updateTag({ name: 'description', content: 'Is je trein te laat? Registreer snel en kaart het hier aan.' });
    this.renderer.setAttribute(document.querySelector('html'), 'lang', 'nl');
    this.authService.autoLogin();
  }
}
