import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User, UserRole } from '../domain/model/user.entity';
import { normalizeRole } from '../../shared/application/role-routing';

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

  constructor(
    private iamApi: IamApi,
    private router: Router,
  ) {
    this.restoreSession();
  }

  signIn(command: SignInCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.signIn(command).subscribe({
      next: (user) => {
        this.setCurrentUser(user);
        this.ensureResolvedRole(user, {
          onSuccess: (resolvedUser) => {
            this.setCurrentUser(resolvedUser);
            this.loadingSignal.set(false);
          },
          onFailure: () => {
            this.errorSignal.set('Unable to resolve user role');
            this.clearCurrentUser();
            this.loadingSignal.set(false);
          },
        });
      },
      error: () => {
        this.errorSignal.set('Invalid email or password');
        this.loadingSignal.set(false);
      },
    });
  }

  signUp(command: SignUpCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi
      .signUp(command)
      .subscribe({
        next: () =>
          this.signIn(
            new SignInCommand({
              email: command.email,
              password: command.password,
            }),
          ),
        error: () => {
          this.errorSignal.set('Registration failed');
          this.loadingSignal.set(false);
        },
      });
  }

  signOut(): void {
    this.loadingSignal.set(false);
    this.errorSignal.set(null);
    this.clearCurrentUser();
  }

  login(email: string, password: string): void {
    this.signIn(new SignInCommand({ email, password }));
  }

  registerUser(userData: { email: string; password: string; role: UserRole }): void {
    this.signUp(new SignUpCommand(userData));
  }

  logout(): void {
    this.signOut();
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

      const restoredUser = new User({
        id: parsedUser.id,
        email: parsedUser.email,
        roles: parsedUser.roles ?? [],
        token: parsedUser.token ?? null,
      });

      this.setCurrentUser(restoredUser);
      if (!this.hasValidRole(restoredUser)) {
        this.loadingSignal.set(true);
        this.ensureResolvedRole(restoredUser, {
          onSuccess: (resolvedUser) => {
            this.setCurrentUser(resolvedUser);
            this.loadingSignal.set(false);
          },
          onFailure: () => {
            this.clearCurrentUser();
            this.loadingSignal.set(false);
            void this.router.navigateByUrl('/login');
          },
        });
      }
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

  private clearCurrentUser(): void {
    this.setCurrentUser(null);
  }

  private ensureResolvedRole(
    user: User,
    callbacks: {
      onSuccess: (user: User) => void;
      onFailure: () => void;
    },
  ): void {
    if (this.hasValidRole(user)) {
      callbacks.onSuccess(user);
      return;
    }

    this.iamApi.getUserById(user.id).subscribe({
      next: (resolvedUser) => {
        callbacks.onSuccess(
          new User({
            id: resolvedUser.id,
            email: resolvedUser.email,
            roles: resolvedUser.roles,
            token: user.token,
          }),
        );
      },
      error: () => {
        callbacks.onFailure();
      },
    });
  }

  private hasValidRole(user: User | null): boolean {
    return normalizeRole(user?.role) !== null;
  }
}
