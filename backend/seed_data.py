from database import SessionLocal
import models

db = SessionLocal()

samples = [
    {
        "title": "W3C WCAG 2.2 Overview",
        "summary": "Official W3C guidelines for web accessibility.",
        "url": "https://www.w3.org/WAI/standards-guidelines/wcag/",
        "category": "STANDARDS",
        "tags": "wcag,standards,guidelines"
    },
    {
        "title": "ARIA Authoring Practices Guide",
        "summary": "Patterns for building accessible widgets with ARIA.",
        "url": "https://www.w3.org/WAI/ARIA/apg/",
        "category": "STANDARDS",
        "tags": "aria,wai,patterns"
    },
    {
        "title": "Radix UI – Accessible Components",
        "summary": "Open-source component library with built-in accessibility.",
        "url": "https://www.radix-ui.com/",
        "category": "FRAMEWORK_LIBRARY",
        "tags": "react,radix,components"
    },
    {
        "title": "Headless UI",
        "summary": "Unstyled, accessible UI components for React and Vue.",
        "url": "https://headlessui.com/",
        "category": "FRAMEWORK_LIBRARY",
        "tags": "react,vue,headless"
    },
    {
        "title": "Material Design Accessibility",
        "summary": "Google's design system accessibility guidance.",
        "url": "https://m3.material.io/foundations/accessible-design/overview",
        "category": "DESIGN_SYSTEM",
        "tags": "material,design,google"
    },
    {
        "title": "Lightning Design System",
        "summary": "Salesforce's design system with accessibility baked in.",
        "url": "https://www.lightningdesignsystem.com/accessibility/",
        "category": "DESIGN_SYSTEM",
        "tags": "salesforce,design,system"
    },
    {
        "title": "How Screen Reader Users Navigate the Web",
        "summary": "Nielsen Norman Group research on screen reader behavior.",
        "url": "https://www.nngroup.com/articles/screen-reader-users/",
        "category": "BEST_PRACTICES",
        "tags": "usability,screen-reader,research"
    },
    {
        "title": "Cognitive Accessibility Guidelines",
        "summary": "W3C guidance for making content usable for people with cognitive disabilities.",
        "url": "https://www.w3.org/TR/coga-usable/",
        "category": "BEST_PRACTICES",
        "tags": "cognitive,accessibility,guidelines"
    }
]

for item in samples:
    # Avoid duplicate entries if run multiple times
    if not db.query(models.ResourceCard).filter_by(title=item["title"]).first():
        db.add(models.ResourceCard(**item))

db.commit()
db.close()
print("Seed data inserted")