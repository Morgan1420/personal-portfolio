Implement the project detail pop-up.

Read first: CLAUDE.md, DESIGN.md, docs/TIMELINE.md and docs/PROJECT_POPUP.md (the spec for this task). Visual reference: docs/design-reference/portfolio-v2.dc.html (live prototype — search "PROJECT =====" and "Pop-up view model") plus project-popup-desktop.dc.html and project-popup-mobile.dc.html. Port values and behaviour, not the prototype's template syntax.

Work on `version2` only (check with `git branch --show-current` first). Never push or merge to `main`.

Steps — stop and show me after step 2 and again at the end:

1. Data
   - The new project files are in src/assets/JSONs/projects/ (one JSON per project; `_template.json` is not a project). Load them with import.meta.glob as described in PROJECT_POPUP.md §1, with dev-time validation warnings.
   - Remove the old `projects` array from projects_education.json (keep education there or move it to education.json) and point the existing timeline at the new loader. The timeline must look and behave exactly as before.
   - Normalise media/link paths (§1 "Paths"): move assets into public/projects/<id>/, rewrite the JSON paths to /projects/<id>/<file>. Don't invent files — give me a list of every path you couldn't resolve.

2. Pop-up shell
   - DetailModal.vue: overlay, card, scroll lock, focus trap, Esc, FLIP open/close from the clicked element, mobile slide-up sheet, reduced-motion, #project/<id> hash + Back button (§5–§7).
   - Wire it to the timeline's project boxes and the BitSpace lane. Education bars keep the existing placeholder content inside the same modal.

3. Project content
   - ProjectDetail.vue with the adaptive rules in §2: every block (facts, media, overview, how it works, outcome, prev/next, sidebar cards, mini timeline) renders only when its data exists, and the layout adapts (facts columns, single column when there's no sidebar, the "on its way" note when the body would be empty).
   - ProjectMedia.vue + YouTubeLite.vue (§4): 16:9 frame, auto contain/cover with fit/focus overrides, thumbnails, video unmounting on switch/close, YouTube lite embed via youtube-nocookie.

4. Check
   - npm run build passes.
   - Test at 390px and 1440px with: rotatory-antenna-system (everything), signal-processing-ui (YouTube items), usrp-x440-tool, cloud-segmentation, bsproof (almost empty), bitspace (venture, ongoing).
   - Keyboard: Tab stays inside the dialog, Esc closes, focus returns to the timeline.
   - Update DESIGN.md (pop-up section → final) and the status table in CLAUDE.md.

Note: usrp-x440-tool.json contains one intentional "[finish this sentence…]" placeholder in its overview — leave it as is.
