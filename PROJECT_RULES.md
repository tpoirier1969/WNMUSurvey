# PROJECT_RULES.md — WNMU-TV Viewer Questionnaire

This file is the controlling project rule file for the WNMU-TV Viewer Questionnaire project.

Before any research, audit, design, QA, repo change, build, package, or deployment work, review and follow:

1. The current ChatGPT project settings
2. This `PROJECT_RULES.md`

If this file conflicts with older chats, stale handoffs, old assumptions, prior temporary patch logic, or outdated documentation, this file controls unless Tod explicitly says otherwise.

---

## 1. Project purpose

Build and maintain a clear, trustworthy, mobile-first WNMU-TV viewer questionnaire and results system that people will actually finish.

The project must balance:

- respondent simplicity
- useful station research
- accurate analytics
- accessibility
- privacy
- maintainable code
- honest handling of older response data

Do not optimize only for collecting more questions. A shorter, clearer questionnaire with better completion is preferred over a long questionnaire with marginal extra detail.

---

## 2. Main branch and backup-branch rule

The `main` branch is always the authoritative live application.

Repository branches may be used only as backup or rollback snapshots.

Do not use branches for:

- development
- experimentation
- staging
- feature work
- review
- testing
- long-running work

Before a substantial or risky change:

1. Create a clearly named backup branch from the current `main` commit.
2. Confirm the backup points to the correct pre-change state.
3. Make the authorized changes directly on `main`.
4. Compare the resulting live state against the backup.
5. Confirm that only intended files changed.

Use names such as:

```text
backup/pre-stage-hub-redesign-2026-07-15
backup/pre-questionnaire-consolidation-2026-07-15
```

Do not create branches named `work`, `feature`, `development`, `staging`, `test`, or similar.

Do not merge backup branches back into `main` during ordinary work. They exist only as preserved rollback points.

Do not force-update `main` without Tod's explicit approval.

---

## 2A. GitHub authentication and worker handoffs

Never include access tokens, passwords, SSH private keys, credential files, authenticated URLs, or other secrets in a worker handoff.

At the beginning of every worker session that may change the repository:

1. Fetch and verify remote `main` before making changes.
2. Confirm that local `main` and remote `main` are synchronized, or explain and safely resolve any difference before editing.
3. Check which GitHub authentication and publishing method is actually available before beginning the work.
4. Record the confirmed remote commit and available authentication method in the handoff or work report.

If command-line Git authentication is unavailable, use the connected GitHub service from the outset rather than waiting until publication to discover the limitation.

After connector-based publishing:

- treat the remote commit SHA as authoritative
- immediately synchronize the local checkout to remote `main`
- confirm that the local and remote trees match
- record the final remote SHA in the handoff or completion report

Never force-push merely to reconcile different commit SHAs when the local and remote trees contain identical content. Resolve the history safely and preserve the tested file content.

An authentication failure is not a lack of authorization. When Tod has already authorized making requested work live on `main`, change to the available approved publishing method without asking him to repeat that authorization.

Worker handoffs must state:

- the repository and live branch
- the last confirmed remote commit
- the publishing method that worked
- whether connector publishing recreated a commit under a different SHA
- whether local and remote histories and file trees are synchronized

Project rules can govern this workflow but cannot transfer or create credentials. Persistent repository credentials, if provided by the platform, must remain in the platform's protected credential system and never be copied into project files or handoffs.

---

## 3. Authorization and action rules

Questions and discussion do not automatically authorize repo edits.

When Tod explicitly asks to build, revise, fix, simplify, redesign, consolidate, or make changes live, do the work directly when the available files and instructions are sufficient.

If Tod asks only for advice, analysis, or a recommendation, answer the question without changing the repo.

Do not create files, delete files, change code, alter questionnaire wording, or modify analytics unless the request authorizes it or the change is directly necessary to complete the authorized task.

If a necessary change expands the requested scope, state it clearly.

---

## 4. Better-way challenge rule

Do not blindly implement a requested change without first checking whether it creates problems with:

- questionnaire completion time
- respondent confusion
- mobile usability
- accessibility
- data quality
- response compatibility
- privacy
- analytics
- maintainability
- technical debt

If a better approach exists, raise it before implementing.

Tod's decision controls after the concern is explained, unless the requested approach would violate safety, privacy, data integrity, accessibility, or project-integrity rules.

---

## 5. Narrow-change rule

Make the narrowest safe change that solves the authorized problem.

Do not quietly bundle unrelated:

- styling changes
- wording changes
- question changes
- analytics changes
- file reorganizations
- schema changes
- storage changes
- results-page changes
- cleanup work
- new features

If an unrelated improvement is noticed, report it separately and leave it unchanged unless Tod authorizes it.

---

## 6. Canonical files and patch-layer rule

The project must have clear canonical files for:

- questionnaire definition
- questionnaire behavior
- test/production mode
- storage
- results calculations
- styles
- version information

Temporary patch or override files may be used only for emergency repair or short-term prototyping.

They must be consolidated into canonical application files during the next planned structural revision.

Do not allow permanent chains of files that modify or override earlier files after load.

New files must represent a real, durable architectural responsibility. Do not create a new file merely to avoid editing the correct canonical file.

Examples of temporary patch patterns that must not become permanent architecture:

- a second questionnaire file that mutates the first
- a test file that deletes canonical routing conditions at runtime
- a behavior helper that only repairs shortcomings in the canonical app file
- multiple CSS files that repeatedly override earlier mobile rules

After consolidation, each responsibility should have one clear source of truth.

---

## 7. Questionnaire architecture

The respondent-facing questionnaire should use no more than five top-level stages unless Tod explicitly approves a different structure.

Current preferred stage model:

1. About You
2. WNMU & You
3. What You Watch
4. What You Want
5. How We're Doing

Existing sections may be reorganized within these stages.

Do not add a new top-level stage casually.

The questionnaire should target a core completion time of about 6–8 minutes, with optional comments allowed to extend that slightly.

The landing page should fit comfortably on a common phone screen without unnecessary scrolling.

---

## 8. Respondent-experience standards

The questionnaire must be:

- mobile-first
- plain-language
- visually clear
- easy to navigate
- short enough to finish
- honest about progress
- usable without sound
- usable with keyboard and screen readers

Avoid:

- giant landing-page text
- long matrices
- horizontal page scrolling
- large undifferentiated topic lists
- repeated questions that produce nearly the same information
- internal station/database terminology without explanation
- unnecessary required questions
- forcing respondents through children's programming questions that do not apply

Where possible:

- combine repeated questions
- simplify answer choices
- use viewer-facing categories
- show one clear task at a time
- provide a stage hub
- show completion status
- allow return to earlier stages

---

## 9. Interactive behavior standards

Interactive stage controls may use motion, depth, pressed states, completion animation, and subtle sound.

Requirements:

- visible pressed state
- keyboard activation
- strong focus state
- practical touch-target size
- accessible state where appropriate
- color is not the only status indicator
- sound is optional and never required
- a visible sound on/off control is provided when sound exists
- failure to play sound must not block navigation
- `prefers-reduced-motion` must be respected

Do not add sounds to every checkbox or radio choice. Use sound sparingly for major stage selection, navigation, or completion moments.

---

## 10. Question ID and data-integrity rules

Every question must have a stable unique ID.

Do not reuse an old ID for a different meaning.

A wording change may keep the same ID only when the underlying meaning remains substantially the same.

A changed meaning requires a new ID.

Removed questions must be documented as retired.

Stored option values must remain stable and separate from viewer-facing labels.

Do not silently reinterpret older responses under a newer question meaning.

Missing historical answers must remain missing. Do not count them as `No`, `None`, zero, or a negative answer.

When categories are combined, preserve a documented mapping from old categories to new categories whenever comparison is intended.

---

## 11. Questionnaire specification

Maintain a separate `QUESTIONNAIRE_SPEC.md` as the living questionnaire blueprint.

It should document:

- top-level stage
- section
- question ID
- viewer-facing wording
- answer type
- stored values
- required/optional status
- routing conditions
- analytics purpose
- results location
- source/provenance for factual station claims
- compatibility notes
- retained/combined/retired status

The spec must be updated when questionnaire structure or meaning changes.

---

## 12. Test-mode and production-mode contract

Test mode must be explicit and controlled by one authoritative configuration.

Test mode may:

- allow blank navigation
- display all conditional questions
- show a visible test banner
- use synthetic responses
- leave the results page open for local review

The working interface must read like the implemented end-user product. Do not place test-data warnings, prototype notices, deployment disclaimers, source-category labels, or speculative reliability language in the viewer-facing questionnaire or primary results presentation. Test mode and synthetic-source metadata remain explicit in configuration, records, exports, and internal documentation.

Production mode must:

- restore intended routing
- restore intended validation
- disable synthetic data as the live source
- protect the results dashboard
- use the approved response database
- show the approved privacy disclosure

Do not let test mode permanently mutate canonical question definitions.

Do not deploy public production with test mode enabled.

Release QA must verify the current mode.

---

## 13. Respondent-profile linkage across questionnaires

Future multi-questionnaire work should use a random pseudonymous respondent ID.

Keep stable profile information separate from individual survey submissions.

Use the respondent ID to link later questionnaires.

Do not rely on names or email addresses inside answer records merely for linkage convenience.

Do not repeatedly ask stable demographic questions when an approved linked profile already contains them.

Each response must record:

- respondent ID when applicable
- questionnaire/schema version
- submission date
- questionnaire part or campaign

Explain clearly to respondents when answers across questionnaires may be linked.

Do not collect personally identifiable information unless Tod approves a clear operational reason.

---

## 14. Privacy and deployment rules

Local prototype mode may use browser storage and synthetic data.

Public production must use an approved database and protected results access.

Synthetic responses must never be mixed with real responses without unmistakable separation.

The project must document:

- what is collected
- whether responses are anonymous or pseudonymous
- whether multiple questionnaires are linked
- retention expectations
- deletion/withdrawal handling when applicable

Do not expose raw response data publicly.

---

## 15. Station-content accuracy rules

Viewer-facing station facts must come from appropriate sources.

Use:

- official WNMU-TV names and channel information
- current WNMU scheduling/internal information where authorized
- the WNMU Programming Library for actual programming-topic inventory
- official PBS sources for PBS App, Passport, and PBS services

Do not:

- invent channel descriptions
- use outdated public names
- expose internal feed labels as viewer-facing names without explanation
- imply WNMU produces programming that it only selects or schedules
- present a printed program guide as currently available when it is not
- make current schedule claims without checking the governing source

---

## 16. Questionnaire-content standard

Every question should produce a distinct, useful answer to at least one of these:

- Who is responding?
- What can they access?
- What do they know?
- What do they watch?
- What do they value?
- What should WNMU prioritize?
- How do they think WNMU is performing?
- How should WNMU communicate with them?

Questions that do not produce a distinct decision or useful analytical result should be removed, combined, simplified, or deferred to a later questionnaire.

Internal Programming Library categories may be mapped to fewer viewer-facing categories when that improves completion and clarity.

---

## 17. Analytics-alignment rule

No questionnaire revision is complete until the results side is reviewed.

For every changed question, scale, option, category, or ID:

- confirm results calculations still work
- confirm filters still work
- confirm denominators are correct
- exclude skipped answers honestly
- handle older responses correctly
- update synthetic data to the current schema
- update CSV/JSON exports when needed
- confirm labels match the live questionnaire
- record the questionnaire version with each response

Do not collect new information that cannot be meaningfully reviewed in the results system unless Tod explicitly approves that temporary state.

Maintain `RESULTS_COVERAGE_LEDGER.md` as the canonical question-to-results inventory. Every live core and follow-up question must have a current ledger row showing its visible-results status, primary future results section, planned presentation, Decision Brief eligibility, export treatment, and denominator or routing notes. Update the ledger whenever questionnaire definitions, routing, result renderers, exports, or schemas change. A questionnaire revision is not analytically complete until the affected ledger rows are current.

---

## 18. Versioning rule

Use one authoritative version source for the live application.

It should identify at minimum:

- questionnaire/schema version
- interface/build version
- release date
- test or production mode
- human-readable label when useful

Each submitted response must record the questionnaire/schema version.

Do not scatter current live version values across unrelated runtime files.

---

## 19. Required QA before live release

At minimum, verify:

- JavaScript syntax
- startup path
- no missing loaded files
- no obsolete script or stylesheet references
- landing page at common phone widths
- no horizontal page scrolling
- stage hub navigation
- active and completed stage states
- touch operation
- keyboard operation
- focus visibility
- sound on/off behavior when sound exists
- reduced-motion behavior
- Previous/Next navigation
- test-mode blank-answer navigation
- production validation
- conditional routing
- draft save and resume
- submission and storage
- results calculations
- filters
- JSON import/export
- CSV export
- older-response compatibility
- desktop Edge/Chrome
- iPhone Safari-sized layout
- Android Chrome-sized layout

Passing a syntax check alone is not enough. Startup and user-path behavior must also be checked.

---

## 20. Documentation freshness rule

When Tod and the assistant make a durable decision about:

- workflow
- architecture
- questionnaire structure
- privacy
- response linkage
- analytics
- QA
- deployment

that decision must be added to `PROJECT_RULES.md` or `QUESTIONNAIRE_SPEC.md` during the next authorized revision.

Do not let important project rules live only in chat history.

Keep `README.md` aligned with the actual live application mode and startup behavior.

---

## 21. Known mistakes to avoid

Do not repeat these mistakes:

- Do not use non-backup branches for work.
- Do not let chat history become the only record of major decisions.
- Do not accumulate permanent patch scripts and override stylesheets.
- Do not change question meaning while retaining the same ID.
- Do not change questionnaire content without reviewing analytics.
- Do not mix synthetic and real responses.
- Do not leave test mode enabled for public release.
- Do not make the landing page oversized on phones.
- Do not use internal station terminology without explanation.
- Do not make sound required.
- Do not bury respondents in large category grids.
- Do not split the survey into multiple questionnaires without a linkage plan.
- Do not collect names or emails merely because linkage would be convenient.
- Do not count missing older answers as negative answers.
- Do not create a new file merely to avoid editing the canonical file.
- Do not leave README instructions stale when live behavior changes.

---

## 22. Decision Brief and qualitative interpretation

The Decision Brief is a rules-based interpretation layer over the canonical results calculations. It must not create a second, conflicting analytics system.

The readable results sections are summary-first. Ordinary categorical charts emphasize percentages and keep repeated selection counts out of the main scan path. Denominators and counts must remain available in calculation disclosures, the Decision Brief, All Data, and exports. Only paired importance-versus-delivery evidence may be labeled as meeting or exceeding expectations; other sections must use descriptive signal, strength, attention, or opportunity language.

Every generated finding must:

- state the answered, paired, routed, or module denominator used
- distinguish core evidence from optional follow-up evidence
- identify optional follow-up populations as voluntary and self-selected
- preserve response-source metadata in records and exports without adding test-data warnings to the primary results presentation
- avoid broad audience claims from small or nonrepresentative samples
- present practical responses as options to investigate, not automatic directives
- recalculate when audience filters change

The current minimum for an automated finding is five usable answers for the stated measure. Meeting that minimum does not make the sample representative or conclusive.

Qualitative theme organization is a review aid, not a statistical finding. Original comments must remain unchanged, remain available under their source questions, and never be rewritten and presented as quotations. Transparent keyword matching may place one comment in more than one theme and must say so.

---

## 23. Optional contact records

Optional post-submission contact details are operational records, not questionnaire answers.

Requirements:

- collect contact information only after a successful core submission and explicit consent
- store contact details under a separate contact schema and storage key or protected production table
- link the operational record through the pseudonymous respondent and core response IDs
- never place names or email addresses inside core or follow-up answer records
- show only an aggregate contact-request count in research results
- exclude contact records and contact details from research JSON and CSV exports
- remove linked test contact records when submitted browser test responses are cleared

The local Test version is not an approved production contact system. Public release requires protected server-side contact storage, access controls, retention and deletion rules, and final respondent-facing privacy language.
