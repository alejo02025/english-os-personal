# English OS · personal Business English learning

Live site: https://alejo02025.github.io/english-os-personal/

## Current learning flow

**Beginner-first:** the opening screen now starts with a seven-step A1–A2 preparation sequence. It teaches basic sentences, present simple, negatives, questions, everyday work vocabulary, a short synthetic listening exercise, and a short writing task. Each activity is structured as:

1. Learning objective — English primary, concise Spanish support.
2. What the exercise helps with, in plain language.
3. Rule plus a worked example.
4. One user answer.
5. Explanation after answering; incorrect answers do **not** count as completed.

The next step is chosen automatically, and stored in this browser. These seven micro-lessons are **not** an A2 qualification or a comprehensive A2 course. Their completion permits access to early, separately labelled *Market Leader Intermediate* Unit 1 practice; a full level assessment has **not** been implemented.

## Book curriculum

*Market Leader Intermediate, 3rd edition* (David Cotton, David Falvey and Simon Kent) remains the long-term guide: 12 units, review sections after units 3, 6, 9 and 12, and Working Across Cultures components. Only initial Unit 1 support activities are available. Other lessons are marked as planned. The copyrighted textbook is not stored in this repository or served publicly.

## Vocabulary

Tap supported English text to see an offline translation if the word is included in the local glossary. The selected word is automatically saved to Vocabulary. Saved cards can be edited. **The Free Dictionary** opens in a new tab for more complete definitions: https://www.thefreedictionary.com/upmarket

That dictionary is an external reference, **not** an integrated translation API. Unrecognized words may be saved without a Spanish definition until you edit the card. The app does not copy external dictionary content.

## PDF Studio

Import personal text-selectable PDFs (up to 35 MB and 250 pages). Extract text locally using pdf.js, navigate by page, search passages, identify recurring terms, display source excerpts and write persistent notes. Local page analysis uses **literal extracted text and simple frequency analysis, not AI comprehension**. Image-only/scanned PDFs require OCR and are unsupported. This version is not a full conversational PDF assistant.

## Privacy and continuity

The app has a browser-local email/password profile gate. **This is not server-based secure authentication** and does not restrict access to the underlying public website and source. Study progress, vocabulary and PDFs stay in browser-local storage. JSON export from Progress includes the original Unit 1 exercise history, new foundations and vocabulary; it does not export PDFs. Export a backup periodically.

## Deployment

The application is static: `index.html` loads `gate.js` and `app.js`, which imports `foundation.js` and `extras.js`. GitHub Pages serves these files. No paid database or server is required.

A previous version's study data is preserved under its original localStorage key. The A1–A2 preparation uses a **separate** key, so old completion records are not reinterpreted as beginner-level achievements.

## Validation performed

- JavaScript syntax checks of the application, foundation module, PDF/vocabulary module and sign-in gate.
- Simulated home, course, foundation, and progress render smoke tests.
- Simulated answer handling for the first foundation exercise (wrong answers don't count; correct answers do).

A complete browser-level screenshot and real public deployment QA have not yet been performed.
