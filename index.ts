import { initializeApp} from '@firebase/app';
import {connectFirestoreEmulator, DocumentReference, DocumentData, deleteDoc, getFirestore, collection, doc, updateDoc, setDoc, onSnapshot, setLogLevel, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence} from '@firebase/firestore';
import firebase from "firebase/compat";

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

const colRef = collection(db, "denver");
const docRef = doc(colRef, "mydoc");

function generateValue(): string {
    const value = `${Date.now()}`;
    return value.substring(value.length - 6);
}

async function updateTheDocument() {
    const value = generateValue();
    console.log(`zzyzx Updating value: ${value}`);
    await updateDoc(docRef, {key: value});
}

async function createTheDocument() {
    const value = generateValue();
    console.log(`zzyzx Setting value: ${value}`);
    await setDoc(docRef, {key: value});
}

async function deleteTheDocument() {
    console.log("zzyzx Deleting the document");
    await deleteDoc(docRef);
}

async function main() {
    document.getElementById("btnCreateDoc").onclick = createTheDocument;
    document.getElementById("btnUpdateDoc").onclick = updateTheDocument;
    document.getElementById("btnDeleteDoc").onclick = deleteTheDocument;

    onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log(`zzyzx Got value: ${ snapshot.get("key") }`);
        } else {
            console.log("zzyzx Got value: [document does not exist]");
        }
    });
}

main();
