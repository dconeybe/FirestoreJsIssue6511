import { initializeApp} from '@firebase/app';
import {connectFirestoreEmulator, Unsubscribe, deleteDoc, getFirestore, collection, doc, setDoc, onSnapshot, setLogLevel, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence} from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "apikey",
    projectId: "myproj",
};

initializeApp(firebaseConfig);

const db = getFirestore();
connectFirestoreEmulator(db, "localhost", 8080);

// To experiment without multi-tab mode, swap the commented lines below.
enableMultiTabIndexedDbPersistence(db);
//enableIndexedDbPersistence(db);

// Uncomment the line below to enable debug logging.
//setLogLevel("debug");

const colRef = collection(db, "FirestoreJsIssue6511");
const docRef = doc(colRef, "TestDoc");
var listenerUnsubscribeFunc: Unsubscribe | null = null;
const startTime: DOMHighResTimeStamp = performance.now();

function elapsedTimeStrFrom(t?: DOMHighResTimeStamp): string {
    if (!t) {
        t = performance.now();
    }
    const milliseconds = t - startTime;
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = (milliseconds - (minutes * 1000 * 60)) / 1000;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds.toFixed(3);
}

function clearLogs() {
    document.getElementById("logPara").innerHTML = "";
}

function log(message: string, t?: DOMHighResTimeStamp) {
    const p = document.getElementById("logPara")
    p.appendChild(document.createTextNode(elapsedTimeStrFrom(t) + " " + message));
    p.appendChild(document.createElement("br"));
}

function generateValue(): string {
    const value = `${Math.round(Date.now() / 250)}`;
    return value.substring(value.length - 3);
}

async function writeToTheDocument() {
    const value = generateValue();
    log(`Setting value: ${value}`);
    await setDoc(docRef, {key: value});
}

async function deleteTheDocument() {
    log("Deleting the document");
    await deleteDoc(docRef);
}

function registerListener() {
    if (listenerUnsubscribeFunc) {
        return;
    }
    listenerUnsubscribeFunc = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            log(
                `Got value: ${snapshot.get("key")}`
                + ` fromCache=${snapshot.metadata.fromCache}`
                + ` hasPendingWrites=${snapshot.metadata.hasPendingWrites}`
            );
        } else {
            log("Got value: [document does not exist]");
        }
    });
    log("Snapshot listener registered")
}

function unregisterListener() {
    if (!listenerUnsubscribeFunc) {
        return;
    }
    listenerUnsubscribeFunc();
    listenerUnsubscribeFunc = null;
    log("Snapshot listener unregistered")
}

function FirestoreJsIssue6511Init() {
    document.getElementById("btnWriteDoc").onclick = writeToTheDocument;
    document.getElementById("btnDeleteDoc").onclick = deleteTheDocument;
    document.getElementById("btnRegisterListener").onclick = registerListener;
    document.getElementById("btnUnregisterListener").onclick = unregisterListener;
    document.getElementById("btnClearLogs").onclick = clearLogs;
    log("FirestoreJsIssue6511Init() complete; document: " + docRef.path);
}

FirestoreJsIssue6511Init();
