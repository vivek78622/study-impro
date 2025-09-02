# Agent Login Page

A responsive login page built with Next.js, TypeScript, and Tailwind CSS that matches the provided design reference.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation, screen reader support, proper ARIA labels
- **Animations**: Smooth fade-in effects and hover interactions
- **Form Validation**: Email validation and password toggle
- **Social Login**: Google, Apple, and Facebook integration ready
- **Modern UI**: Clean design with proper spacing and typography

## Usage

Navigate to `/login` to see the login page.

## Customization

### Brand Configuration
Edit the following in `src/app/login/page.tsx`:

```tsx
// Brand name and email
<h1 className="text-2xl font-bold text-black">Razor</h1>
<a href="mailto:Sales@Razor.uk">Sales@Razor.uk →</a>

// Footer text
Copyright @wework 2022 | Privacy Policy
```

### Colors
Update colors in `tailwind.config.js`:

```js
colors: {
  'login-bg': '#FDF8F3',      // Background color
  'login-primary': '#F4B566',  // Primary button color
  'login-yellow': '#F4D03F',   // Decorative elements
}
```

### Social Providers
Modify `src/components/SocialButton.tsx` to add/remove providers or change icons.

## File Structure

```
src/
├── app/
│   └── login/
│       └── page.tsx          # Main login page
├── components/
│   ├── ui/                   # Existing UI components
│   └── SocialButton.tsx      # Social login buttons
```

## Dependencies Added

- `framer-motion`: For smooth animations (optional, can use CSS animations instead)

## Responsive Breakpoints

- **Mobile**: < 768px - Stacked layout, simplified decorations
- **Tablet**: 768px - 1024px - Partial decorations visible
- **Desktop**: > 1024px - Full layout with all decorative elements

## Accessibility Features

- Proper heading hierarchy (h1, h2)
- Form labels and ARIA attributes
- Keyboard navigation support
- Focus indicators
- Screen reader announcements
- High contrast text