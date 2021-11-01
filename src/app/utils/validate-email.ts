import { AbstractControl } from "@angular/forms";
import { AuthenticationService } from "../services/authentication.service";
import { map } from 'rxjs/operators';

export class ValidateEmail {
  static checkForExistingEmail(authService: AuthenticationService) {
    return (control: AbstractControl) => {
      return authService.emailExists(control.value).pipe(map(res => {
        return res.length > 0 ? { emailTaken: true } : null;
      }));
    }
  }
}
