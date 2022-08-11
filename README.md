# Repro App for Firestore JS Issue 6511

This small web app reproduces the Firestore bug reported in https://github.com/firebase/firebase-js-sdk/issues/6511:
"Mutating data with Firestore multi-tab-persistence from a browser tab which is not the leader tab causes stale data to emit"

# Steps to Reproduce

1. Start the Firestore emulator (`firebase emulators:start --only firestore`).
2. Run `yarn`.
3. Run `yarn build`.
4. Run `python -m http.server`.
5. Open a web browser to http://localhost:8000.
6. Open another web browser tab to the same URL, http://localhost:8000.
7. Open the debug console on both tabs, so that you can see text written via `console.log()`.
8. Press the "create", "update", and "delete" buttons and observe the text logged to the console.

# Expected Results

The "Got value" lines logged always show the latest value.

# Actual Results

The "Got value" lines logged usually show the latest value;
however, sometimes it shows the latest value, followed by the previous value, followed by the latest value again.
