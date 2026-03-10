# Message to Sanity Support

**Subject:** Image uploads hang indefinitely on project jdi6zc8z (worked on nok9of5b)

---

Hi,

I'm experiencing a critical issue with image uploads in Sanity Studio that started after migrating to a new project.

**Problem:**
- When uploading images in Sanity Studio, the upload gets stuck on "Loading" indefinitely
- This happens even with small images (e.g. 75 KB)
- The only workaround is to pre-process images through TinyPNG/Tiny Optimizer before uploading – then they work fine

**Context:**
- **Old project (worked fine):** nok9of5b
- **New project (broken):** jdi6zc8z
- Same codebase, same configuration – only the project ID changed
- Migration was done via scripts (migrate documents + migrate assets)

**What we've tried:**
- CORS origins are correctly configured (localhost:3000, kings-cow.vercel.app, etc.) with credentials allowed
- Updated to latest Sanity (5.13.0) and next-sanity (12.1.1)
- Verified all image references in documents are valid (no broken refs)
- Usage quota is fine (3.2 GB / 250 GB assets)
- No invalid metadata options in image schema (only `hotspot: true`)

**Technical details:**
- Sanity Studio embedded in Next.js app
- Dataset: production
- Plan: Team

The fact that Tiny Optimizer fixes it suggests the issue may be related to image metadata (EXIF, etc.) – perhaps the new project handles metadata extraction differently, or there's a backend bug specific to this project.

Could you please investigate why image uploads work on nok9of5b but fail on jdi6zc8z? Is there any project-specific configuration or known issue we should be aware of?

Thank you for your help.
