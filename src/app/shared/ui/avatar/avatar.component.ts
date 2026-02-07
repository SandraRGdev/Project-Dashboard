import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  // Inputs
  readonly name = input.required<string>();
  readonly src = input<string>('');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly clickable = input<boolean>(false);
  readonly status = input<'online' | 'offline' | 'away' | 'busy'>();

  // Computed: initials from name
  protected readonly initials = computed(() => {
    const name = this.name();
    const parts = name.trim().split(' ');

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  // Computed: gradient based on name
  protected readonly gradient = computed(() => {
    const name = this.name();
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];

    return gradients[hash % gradients.length];
  });

  // Computed: size styles
  protected readonly sizeStyles = computed(() => {
    const sizes = {
      xs: '1.5rem',
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
      xl: '4rem'
    };

    return {
      width: sizes[this.size()],
      height: sizes[this.size()],
      fontSize: this.size() === 'xs' ? '0.5rem' :
                this.size() === 'sm' ? '0.625rem' :
                this.size() === 'md' ? '0.75rem' :
                this.size() === 'lg' ? '0.875rem' : '1rem'
    };
  });

  protected readonly avatarClass = computed(() => {
    const classes = ['avatar'];

    if (this.clickable()) {
      classes.push('avatar--clickable');
    }

    return classes.join(' ');
  });

  protected readonly hasImage = computed(() => !!this.src());
}

// Add signal import
import { signal } from '@angular/core';
