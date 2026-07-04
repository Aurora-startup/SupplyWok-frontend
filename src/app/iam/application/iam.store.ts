import { Injectable, computed, signal } from '@angular/core';
import { IamApiService } from '../infrastructure/iam-api.service';
import { User, UserRole } from '../domain/model/user.entity';

@Injectable({
  providedIn: 'root',
})
export class IamStore {
  private static readonly CURRENT_USER_STORAGE_KEY = 'iam.currentUser';
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly currentUserRole = computed(() => this.currentUserSignal()?.role || null);

  constructor(private iamApi: IamApiService) {
    this.restoreSession();
  }

  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.signIn({ email, password }).subscribe({
      next: (user) => {
        this.setCurrentUser(user);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Invalid email or password');
        this.loadingSignal.set(false);
      },
    });
  }

  registerUser(userData: { email: string; password: string; role: UserRole }): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi
      .signUp({
        email: userData.email,
        password: userData.password,
        roles: [userData.role === 'Supplier' ? 'ROLE_SUPPLIER' : 'ROLE_RESTAURANT'],
      })
      .subscribe({
        next: () => this.login(userData.email, userData.password),
        error: () => {
          this.errorSignal.set('Registration failed');
          this.loadingSignal.set(false);
        },
      });
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const rawUser = window.localStorage.getItem(IamStore.CURRENT_USER_STORAGE_KEY);
      if (!rawUser) {
        return;
      }

      const parsedUser = JSON.parse(rawUser) as {
        id: number;
        email: string;
        roles?: string[];
        token?: string | null;
      };

      this.currentUserSignal.set(
        new User({
          id: parsedUser.id,
          email: parsedUser.email,
          roles: parsedUser.roles ?? [],
          token: parsedUser.token ?? null,
        }),
      );
    } catch {
      window.localStorage.removeItem(IamStore.CURRENT_USER_STORAGE_KEY);
    }
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);

    if (typeof window === 'undefined') {
      return;
    }

    if (user) {
      window.localStorage.setItem(IamStore.CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(IamStore.CURRENT_USER_STORAGE_KEY);
  }
}
