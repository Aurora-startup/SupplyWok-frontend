import { Injectable, computed, signal } from '@angular/core';
import { IamApiService } from '../infrastructure/iam-api.service';
import { User } from '../domain/model/user.entity';

/**
 * Signal-based store for managing Identity and Access Management state in Angular.
 */
@Injectable({
  providedIn: 'root',
})
export class IamStore {
  private readonly usersSignal = signal<User[]>([]);
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // --- Readonly Signals (Getters) ---
  readonly users = this.usersSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly currentUserRole = computed(() => this.currentUserSignal()?.role || null);

  constructor(private iamApi: IamApiService) {}

  /**
   * Loads all users from the API.
   */
  loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUsers().subscribe({
      next: users => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Failed to load users');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Simulates a login process by fetching all users and matching credentials locally.
   * @param email
   * @param password
   */
  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUsers().subscribe({
      next: allUsers => {
        const user = allUsers.find(u => u.email === email && u.password === password);
        if (user) {
          this.currentUserSignal.set(user);
        } else {
          this.errorSignal.set('Invalid email or password');
        }
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Login process failed');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Registers a new user.
   * @param userData
   */
  registerUser(userData: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createUser(userData).subscribe({
      next: newUser => {
        if (newUser) {
          this.usersSignal.update(users => [...users, newUser]);
        }
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Registration failed');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Clears the current user session.
   */
  logout(): void {
    this.currentUserSignal.set(null);
  }
}
