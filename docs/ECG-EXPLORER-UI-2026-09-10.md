# ECG Explorer interaction review — 10 September 2026

The diagnosis change handler replaced the native select and immediately focused its replacement during the native selection event. This can reopen the picker. Case and zoom changes now retain the original select and restore existing keyboard focus on the next animation frame only if focus has not moved elsewhere.

The focused strip is a selected-lead teaching tracing; its format label is separate from the current diagnosis. Choosing a finding updates its explanation, red waveform regions and cropped detail. Next marked region cycles the crop. Focus this finding sets 200% zoom and scrolls the main paper. Fixed that action to target the region currently selected in the crop, rather than always targeting the first region.

Desktop uses a diagnosis panel beside the tracing with its own scrolling. Mobile stacks it below the tracing. The full ECG is an overview; the detail crop and zoom controls support closer inspection. Practice hides the diagnosis and findings until reveal, while location practice hides the marked answer until requested. Comparison, completion and saved-review controls retain their existing behavior.

Verification: all 79 Node tests pass. Local Chrome browser audits exercised all 47 cases and their findings at desktop and mobile viewport sizes (1280, 390 and 320 pixels), including enlarged view, reveal/reset, comparison, location practice and progress. The audit now checks native picker identity and selected-region focusing. Targeted browser checks cover keyboard picker closure and the actual application route. Desktop and mobile screenshots were visually inspected. These checks use mobile emulation, not physical devices; no live deployment was performed.

Release references: `20260910-explorer-r2`; installation-scoped worker cache: `v161`. The worker cache test now derives the current revision so future release bumps do not falsely fail cache-isolation checks.
