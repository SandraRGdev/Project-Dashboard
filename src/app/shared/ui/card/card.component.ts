import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  // Inputs
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<boolean>(false);
  readonly clickable = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly variant = input<'default' | 'metric' | 'compact'>('default');

  // Outputs
  readonly clicked = output<void>();

  // Computed
  protected get cardClass(): string {
    const classes = ['card'];
    classes.push(`card--${this.variant()}`);

    if (this.clickable() && !this.disabled()) {
      classes.push('card--clickable');
    }
    if (this.selected()) {
      classes.push('card--selected');
    }
    if (this.disabled()) {
      classes.push('card--disabled');
    }

    return classes.join(' ');
  }

  protected handleClick(): void {
    if (this.clickable() && !this.disabled()) {
      this.clicked.emit();
    }
  }
}
