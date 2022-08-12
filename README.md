# Repro App for Firestore JS Issue 6511

This small web app reproduces the Firestore bug reported in https://github.com/firebase/firebase-js-sdk/issues/6511:
"Mutating data with Firestore multi-tab-persistence from a browser tab which is not the leader tab causes stale data to emit"

Through bisection, it was found that this bug was introduced in v9.6.10.
It was also reproduced in 9.8.0 and 9.9.2, and likely exists in all versions
sinve 9.6.10.

A similar bug, which has existed since at least 9.0.0, can also be reproduced
by replacing the click of the "Update the document" button in the last step
with a click of the "delete" button followed by the "create" button.

# Steps to Reproduce

1. Start the Firestore emulator (`firebase emulators:start --only firestore`)
2. Run `yarn`
3. Run `yarn build`
4. Run `python -m http.server`
5. Open a web browser to http://localhost:8000 ("Tab 1")
6. Click the "Write" button to create the document
7. Open another web browser tab to the same URL, http://localhost:8000 ("Tab 2")
8. Refresh Tab 1
9. Refresh Tab 2
10. Click "Register Snapshot Listener" on Tab 1
10. Click the "Clear Logs" button on Tab 1
11. Press the "Write" button in Tab 2

# Expected Results

In Tab 1 there is one "Got value" line logged with the value set by Tab 2.

# Actual Results

In Tab 1 there are 3 "Got value" lines logged:
The 1st line has the new value (as expected);
The 2nd line has the old value;
The 3rd line has the new value.
