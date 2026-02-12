# MASON IVR - Design System & Vision

## 🎯 Design Philosophy

The MASON platform is being redesigned with a **motion-based, neumorphistic neo-brutalist** approach. This design system prioritizes accessibility, clarity, and approachability for users of all ages, particularly older adults who benefit from large text, high contrast, and meaningful but simple animations.

---

## 📐 Core Design Principles

### 1. **Neumorphism**
- **Soft shadows** instead of hard borders for depth
- **Subtle inset/outset effects** to create button states
- **Minimal color palettes** with strong, readable contrast
- **Tactile feedback** through elevation and depression
- No unnecessary gradients

### 2. **Neo-Brutalism**
- **Bold, heavy sans-serif typography** (Inter, System fonts)
- **Raw and honest design** - what you see is what you get
- **Strong geometric forms** with clean lines
- **High contrast values** for readability
- **Minimal decorative elements**
- **Stark color blocks** instead of subtle transitions

### 3. **Motion-Based**
- **Simple, purposeful animations** - every motion has meaning
- **Ease-in-out timing** for natural movement
- **Accessibility first** - all animations respect `prefers-reduced-motion`
- **Slow enough for comprehension** (300ms-1500ms durations)
- **Entrance/exit animations** guide user attention

### 4. **Accessibility for Older Adults**
- **Minimum 18px body text** (larger than standard web)
- **Line height 1.6+** for comfortable reading
- **High contrast ratios** (WCAG AAA compliance)
- **Large touch targets** (minimum 44x44px buttons)
- **Simple interactions** - no hover-only controls
- **Clear visual feedback** for all actions
- **No flashing/seizure-inducing animations**

---

## 🎨 Color Palette

### Primary Colors
- **Deep Navy**: `#1a1f3a` - Main text, dark elements
- **Light Beige**: `#f5f1ed` - Background, negative space
- **Clay Orange**: `#c17257` - Primary action, emphasis
- **Slate Gray**: `#6b7280` - Secondary text, disabled states

### Accent Colors
- **Success Green**: `#4b9170` - Confirmations, positive actions
- **Warning Amber**: `#d97706` - Alerts, important notices
- **Error Red**: `#dc2626` - Errors, cancellations

### Surfaces
- **Surface Light**: `#fafaf9` - Cards, containers
- **Surface Dark**: `#27272a` - Dark mode backgrounds
- **Overlay**: `rgba(26, 31, 58, 0.1)` - Shadows with depth

---

## 🔤 Typography

### Font Stack
```
Font family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif
Fallback: Arial, sans-serif
```

### Scale & Hierarchy
- **H1 (Headlines)**: 40px-48px, weight 700-900, line-height 1.2
- **H2 (Subheadings)**: 28px-32px, weight 700, line-height 1.3
- **H3 (Section headers)**: 20px-24px, weight 600, line-height 1.4
- **Body**: 18px-20px, weight 400, line-height 1.6
- **Small text**: 14px-16px, weight 400, line-height 1.5
- **Labels**: 14px, weight 600, line-height 1.4

### Weight Classes
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Black: 900

---

## 🎬 Animation & Motion

### Principles
1. **Respect `prefers-reduced-motion`** - provide fallback no-animation versions
2. **Duration**: 300-800ms for most interactions
3. **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)
4. **Purpose-driven**: Every animation communicates state change

### Animation Library

#### Entrance Animations
```css
/* Fade In - 300ms */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up - 400ms */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In - 300ms */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### State Change Animations
```css
/* Pulse - 2000ms (subtle feedback) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Subtle Lift - 400ms (on hover/focus) */
@keyframes subtleLift {
  from { 
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(0);
  }
  to { 
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    transform: translateY(-4px);
  }
}

/* Bounce (0.5s, for loading states) */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

#### Loading States
```css
/* Loading Spinner - 1s continuous */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Progress Bar Fill - 3s */
@keyframes progressFill {
  from { width: 0%; }
  to { width: 100%; }
}
```

### Accessibility Considerations
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 Component Styles

### Buttons

#### Primary Button
- **Style**: Solid clay orange background
- **Text**: Bold, white, large (18px)
- **Padding**: 16px 32px
- **Border radius**: 8px (slightly rounded, not rounded)
- **Shadow**: Soft neumorphic shadow - `0 4px 12px rgba(0,0,0,0.1)`
- **Hover State**: 
  - Lift animation (translate Y: -4px)
  - Shadow deepens
  - Slight color darken
- **Focus**: Visible focus ring (2px solid outline)
- **Disabled**: Reduced opacity, no hover effect

#### Secondary Button
- **Style**: Light background with bold border
- **Border**: 2px solid navy
- **Text**: Navy, bold
- **Hover**: Light orange tint background
- **No excessive scales** - just color and shadow changes

#### Tertiary (Text Button)
- **Style**: No background, navy text
- **Underline**: On hover only
- **Focus**: Visible outline

### Cards (Neumorphic)
- **Background**: Light beige surface
- **Shadow**: Soft inset shadow for depth - `inset 0 1px 3px rgba(0,0,0,0.05)`
- **Border**: Subtle 1px solid `rgba(0,0,0,0.05)`
- **Padding**: 24px-32px
- **Border radius**: 12px
- **Content**: High contrast text on light background

### Input Fields
- **Style**: Light background with subtle border
- **Border**: 1px solid slate gray
- **Focus**: 3px solid outline in primary color (clay orange)
- **Label**: Bold, 14px, sitting above field
- **Font size**: 18px (prevents zoom on iOS for old users)
- **Padding**: 14px 16px
- **Error state**: Red border + error text below

### Navigation Elements
- **Structure**: Single-level, clear labels
- **Spacing**: Generous padding between items
- **Focus indicators**: Always visible

---

## 📱 Layout & Spacing

### Spacing Scale
```
4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

### Standard Padding/Margin
- **Compact**: 8px-12px
- **Standard**: 16px-24px
- **Generous**: 32px-48px
- **Section gaps**: 48px-64px

### Container Max-Width
- **Mobile**: Full width - 16px padding
- **Tablet**: 600px
- **Desktop**: 1024px

### Grid System
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 2-3 columns (with Tailwind `grid-cols-*`)

---

## ✅ Accessibility Checklist

- [ ] All text has minimum 18px size
- [ ] Contrast ratio minimum 7:1 (WCAG AAA)
- [ ] All buttons are minimum 44x44px click targets
- [ ] Focus indicators visible on all interactive elements
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are clear and actionable
- [ ] No navigation that relies only on hover
- [ ] Color is not the only indicator of state
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets have adequate spacing (minimum 8px between)
- [ ] Links are always underlined or clearly styled

---

## 🎯 Implementation Details

### Tailwind Configuration
- Extend with custom neumorphic shadows
- Define custom animations
- Set minimum font sizes to 16px (body)
- Generate high contrast color utilities

### CSS-in-JS Pattern
- Use `<style jsx>` for page-specific animations
- Keep global animations in `globals.css`
- Avoid inline styles - use classes

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (tablet), 1024px (desktop)
- Always test with actual touch devices
- Ensure readable on 1920x1080 and 375x667 viewports

---

## 📋 Migration Checklist

- [x] Define design system
- [x] Update color palette
- [x] Create animation library
- [ ] Update homepage
- [ ] Update hire page
- [ ] Update hire login
- [ ] Update apply page
- [ ] Test with older adults
- [ ] Audit accessibility
- [ ] Performance testing (Core Web Vitals)

---

## 🚀 Future Enhancements

1. **Dark Mode**: Provide high-contrast dark theme
2. **Font Scale Increments**: Allow users to increase font size globally
3. **Haptic Feedback**: Subtle vibrations for mobile interactions
4. **Voice Controls**: Integration with accessibility features
5. **Simplified Language Mode**: Strip down copy for clarity

---

**Last Updated**: February 12, 2026  
**Version**: 1.0 (Initial Design System)
