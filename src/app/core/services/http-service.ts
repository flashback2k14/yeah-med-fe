import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageKeys } from './auth-service';
import { API_BASE_URL } from '../tokens';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  get<T>(route: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${route}`, {
      headers: this._getHeadersWithUser(),
    });
  }

  create<TData>(route: string, data: TData): Observable<TData>;
  create<TData, TReturn>(route: string, data: TData): Observable<TReturn>;
  create(route: string, data: unknown) {
    return this.http.post(`${this.baseUrl}${route}`, data, {
      headers: this._getHeadersWithUser(),
    });
  }

  update<TData>(route: string, data: TData): Observable<TData>;
  update<TData, TReturn>(route: string, data: TData): Observable<TReturn>;
  update(route: string, data: unknown) {
    return this.http.put(`${this.baseUrl}${route}`, data, {
      headers: this._getHeadersWithUser(),
    });
  }

  private patch<TData>(route: string, data: TData): Observable<TData>;
  private patch<TData, TReturn>(
    route: string,
    data: TData
  ): Observable<TReturn>;
  private patch(route: string, data: unknown) {
    return this.http.patch(`${this.baseUrl}${route}`, data, {
      headers: this._getHeadersWithUser(),
    });
  }

  delete<TReturn>(route: string, data?: unknown): Observable<TReturn> {
    return this.http.delete<TReturn>(`${this.baseUrl}${route}`, {
      body: data,
      headers: this._getHeadersWithUser(),
    });
  }

  private _getHeadersWithUser(): HttpHeaders {
    const userId = localStorage.getItem(StorageKeys.USER_ID) ?? 'doe';
    return new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('x-user-id', userId);
  }
}
