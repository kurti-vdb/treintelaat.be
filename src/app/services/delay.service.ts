import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Delay } from '../models/delay';

@Injectable({
  providedIn: 'root'
})
export class DelayService {

  public totalDelays: number = 0;
  private delay: Delay | undefined;
  private delays: Delay[] = [];
  private delaySubject = new Subject<Delay>();
  private totalDelaysSubject = new Subject<number>();
  private delaysSubject = new Subject<Delay[]>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

  }

  getDelaySubject() {
    return this.delaySubject.asObservable();
  }

  getDelaysSubject() {
    return this.delaysSubject.asObservable();
  }

  getTotalDelaysSubject() {
    return this.totalDelaysSubject.asObservable();
  }

  addDelay(delay: Delay) {
    this.delays.push(delay);
    this.delaysSubject.next([...this.delays]);
    this.httpClient.post(environment.apiUrl + '/api/delay', delay)
      .subscribe((response) => {
        this.getDelays();
    })
  }

  getDelays() {
    return this.httpClient.get<{ status: string, delays: Delay[] }>(environment.apiUrl + '/api/delays')
      .pipe(
        tap(response => {
          this.delays = response.delays;
          this.delaysSubject.next([...this.delays]);
        }),
        catchError (err => {
          return throwError(err);
        })
      );
  }

}
