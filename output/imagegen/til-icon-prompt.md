# TIL dock icon

- Generated with the built-in image generation tool.
- Base reference: `public/icons/dock/resume.webp`.
- Supporting reference: `public/icons/dock/projects.webp`.
- Original generated image: `output/imagegen/til-icon.png`.
- Site asset: `public/icons/dock/til.webp` (512 × 512 WebP).
- The generator returned opaque RGB despite the alpha request. The dock clips the image to the rounded tile silhouette with CSS; the standalone PNG/WebP does not have transparency.

## Initial prompt

Use-case: precise-object-edit.
Create ONE finished TIL (Today I Learned) learning-journal dock icon for an existing portfolio desktop OS.
Image 1 (resume.webp) is the base icon to adapt into a NEW sibling icon: keep its glass blue rounded-square tile, framing, glossy rim, very rounded corners, front-on orientation, pale icy cyan upper area, saturated cobalt bottom, top-left lighting, soft ambient shadows, and polished soft 3D material language unchanged.
Image 2 (projects.webp) is a supporting style reference for object scale and friendly sculpted 3D detail; do not combine the icons.
Change ONLY the foreground resume document/person/check mark into a single open learning notebook. It has thick warm ivory pages gently curving into a clear central spine, a dark teal/navy cover visible along the outer bottom edges, three short subtle raised navy note lines on each page, and one small golden-yellow ribbon bookmark emerging from the bottom of the central spine. A clean symmetrical open-book silhouette, upright facing the viewer, with slight natural 3D depth. The book fills roughly 68 percent of the canvas width and is visually centered, balanced similarly to the document in the base icon. All book details must remain clear at 56px dock display size.
Use the exact reference family palette and soft glossy sculptural style. No letters, no words, no TIL text, no pencil, no bulb, no sparkles, no extra badge, no envelope, no person glyph or check mark. Output one square icon at 1024x1024, with the rounded tile nearly filling the canvas as in the references and genuinely transparent alpha outside its rounded silhouette. No opaque white background, no checkerboard drawn into the image, no mockup, no multi-icon sheet.
## Final edge-refinement prompt

Use-case: background-extraction.
Edit this finished TIL dock icon by correcting ONLY the exterior background and edge quality. Keep the book, golden bookmark, colors, glass tile, proportions, and front-on composition exactly unchanged.
The supplied PNG currently has an OPAQUE BLACK background outside the rounded blue glass tile and white edge speckles. This must be a genuine transparent PNG cutout: output RGBA with alpha 0 outside the rounded-square silhouette, with clean antialiased alpha edges, removing all black background and the white speckle fringe. The blue rounded-square tile itself and everything inside it remain fully opaque. Do not replace black with a solid white background, and do not draw checkerboard pixels. A real alpha channel is essential for use over arbitrary desktop wallpapers. Return only the single corrected square icon.
