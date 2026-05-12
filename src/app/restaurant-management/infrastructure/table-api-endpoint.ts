export class TableApiEndpoint {
  static readonly BASE = 'http://localhost:3000/tables';

  static byId(id: number): string {
    return `${this.BASE}/${id}`;
  }
}
