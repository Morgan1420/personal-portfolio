# Project Specification: Digital Portfolio & CV (Natural Tech Edition)

## 1. Context & Persona

- **User:** 22-year-old Double Degree Graduate (Telecom Engineering & Computer Science) with entrepreneurial experience.
- **Vibe:** Clean, Architectural, Innovative, Professional.
- **Color Palette:** - **Main (Background):** Pure White (#FFFFFF) or a very light "Paper" White (#FAFAFA).
  - **Secondary (Accents/Sections):** Soft Beige (#F5F5DC / #E3D5CA) — Use for section backgrounds or card surfaces.
  - **Primary Action (Green):** Forest Green (#2D5A27) or Sage Green (#7D907D).
  - **Text:** Dark Slate (#1A1A1A) for readability.

## 2. Technical Requirements

- **Architecture:** Component-based (Modular).
- **Styling:** Tailwind CSS (preferred).
- **Placeholders:** - Text: "Lorem Ipsum".
  - Images: "random image" source, but each must be assigned to a specific variable (e.g., `experience_BitSpace_main`).

## 3. Component Breakdown

### [Component: Navbar]

- Sticky top. Minimalist design.
- Links: About, Experience, Projects, Skills, Contact.
- Social Links: GitHub, LinkedIn icons in Green.

### [Component: Hero]

- **Layout:** Horizontal Split.
- **Left Side:** - Name (Bold, Serif or clean Sans-serif).
  - Roles: "Telecom Engineering | CS | Entrepreneur".
  - Brief Bio sentence.
  - Button 1 (Fill): "Download CV" (Green background).
  - Button 2 (Outline): "Contact Me" (Green border).
- **Right Side:** Background photo placeholder (User photo) positioned to the right.

### [Component: AboutMe]

- **Background:** Soft Beige.
- **Heading:** Small "/About me" text in Green followed by main title.
- **Left:** Circular profile image (add a subtle Green or Beige border).
- **Right:** Main biographical text.

### [Component: Experience]

- **Type:** Carousel Section.
- **Design:**
  - Blurred background image (low opacity) based on the current entry.
  - **Left:** Entry Title and Project Description.
  - **Right:** "E-commerce Style" Gallery. One large featured image + horizontal list of thumbnails below to toggle the main image.
- **Entries:** BitSpace, IEEC, CVC.

### [Component: Projects]

- **Layout:** Alternating Z-pattern (Image-Text / Text-Image).
- **Quantity:** 3 featured items.
- **Footer:** "See more" button (Green) linking to a future Project component.

### [Component: Skills]

- **Design:** Three horizontal "Infinite Marquee" lists.
- **Background:** Very light Beige.
- **Labels:** "Expertise", "Proficiency", "Interests".
- **Default:** 20 "Python" items per list.
- **Styling:** Small Green pills/tags with White text.

### [Component: MyHistory]

- **Status:** Empty container/Placeholder.

### [Component: Contact]

- **Layout:** Centered form on a White background.
- **Fields:** Name, Email, Message placeholder.
- **Submit:** Green button.

## 4. Global Instructions

- **Responsiveness:** Ensure all side-by-side layouts stack vertically on mobile.
- **Typography:** Use a mix of a professional Serif for headings (classic/entrepreneurial) and a clean Sans-serif or Monospace for technical details.
- **Modularity:** Every section must be a standalone component file.
