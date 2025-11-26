# Implementation Plan - Landing Page Redesign

## Goal
Redesign the Landing Page (`/`) to create a high-converting, minimalist SaaS entry point that aligns with the new application design.

## User Review Required
> [!IMPORTANT]
> The "Mockups" will be implemented as CSS/HTML representations or placeholders. You may need to replace them with actual high-res screenshots of your finished dashboard later for maximum impact.

## Proposed Changes

### `app/page.tsx`
- **Header (Hero)**:
    - H1: "Arrêtez de perdre du temps à faire des devis. Recevez des paiements 3x plus vite."
    - Subtitle: "L'outil de facturation conçu pour les freelances qui veulent rester focus sur leur métier."
    - CTA: "Créer votre premier devis gratuitement" -> `/devis/new`
    - Social Proof: "Utilisé par +500 freelances" (Static text/logos)
- **Visuals**:
    - Replace the interactive preview with a static, high-quality composition showing the **Dashboard** and **Editor** side-by-side or overlapping.
- **Value Section (3 Pillars)**:
    - **Vitesse**: Focus on the Editor.
    - **Professionnalisme**: Focus on the PDF output.
    - **Suivi**: Focus on the Dashboard stats.
- **Pricing**:
    - Simple 3-column pricing table (Free / Pro / Enterprise).
- **Footer**:
    - Standard SaaS footer with links.

## Verification Plan
### Manual Verification
- Check that the CTA links correctly to `/devis/new`.
- Verify responsive design (mobile/desktop).
- Ensure visual consistency with the app (fonts, colors).
