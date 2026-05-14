import { Injectable, computed, signal } from '@angular/core';
import { IamApiService } from '../infrastructure/iam-api.service';
import { User } from '../domain/model/user.entity';
import { firstValueFrom } from 'rxjs';

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
  async loadUsers(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const users = await firstValueFrom(this.iamApi.getUsers());
      this.usersSignal.set(users);
    } catch (err) {
      this.errorSignal.set('Failed to load users');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Simulates a login process by fetching all users and matching credentials locally.
   * @param email 
   * @param password 
   * @returns True if login is successful.
   */
  async login(email: string, password: string): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const allUsers = await firstValueFrom(this.iamApi.getUsers());
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        this.currentUserSignal.set(user);
        return true;
      } else {
        this.errorSignal.set('Invalid email or password');
        return false;
      }
    } catch (err) {
      this.errorSignal.set('Login process failed');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Registers a new user.
   * @param userData 
   */
  async registerUser(userData: User): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const newUser = await firstValueFrom(this.iamApi.createUser(userData));
      if (newUser) {
        this.usersSignal.update(users => [...users, newUser]);
        return true;
      }
      return false;
    } catch (err) {
      this.errorSignal.set('Registration failed');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Clears the current user session.
   */
  logout(): void {
    this.currentUserSignal.set(null);
  }
}
