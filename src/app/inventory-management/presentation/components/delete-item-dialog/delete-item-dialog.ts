import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-item-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-item-dialog.html',
  styleUrl: './delete-item-dialog.css',
})
export class DeleteItemDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteItemDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { itemName: string },
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
