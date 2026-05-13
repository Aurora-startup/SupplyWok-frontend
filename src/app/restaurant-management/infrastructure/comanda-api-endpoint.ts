export class ComandaApiEndpoint {
  static readonly BASE = 'http://localhost:3000/comandas';

  static byId(id: number): string {
    return `${this.BASE}/${id}`;
  }
}
