import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDlvXCCAHBCiCPMaI03r2ij-omnzJx2MvE',
	authDomain: 'simondmc-board.firebaseapp.com',
	databaseURL: 'https://simondmc-board-default-rtdb.firebaseio.com',
	projectId: 'simondmc-board',
	storageBucket: 'simondmc-board.appspot.com',
	messagingSenderId: '1091565095497',
	appId: '1:1091565095497:web:e183babfa54252e3868d98',
	measurementId: 'G-03NWFCBC25'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

// write to db
export async function write(path: string, data: any) {
	try {
		await set(ref(db, path), data);
	} catch (error) {
		await auth.signOut();
		console.log(error);
		window.location.href = '../unauthorized';
	}
}

// get from db
export async function read(path: string) {
	const dbRef = ref(db);
	const snapshot = await get(child(dbRef, path));
	if (snapshot.exists()) {
		return snapshot.val();
	}
}

// get if path exists in db
async function exists(path: string) {
	return get(ref(db, path)).then((snapshot) => {
		return snapshot.exists();
	});
}

// auth
const provider = new GoogleAuthProvider();
export const auth = getAuth();

// login
export const login = () => {
	signInWithPopup(auth, provider).then(async (result) => {
		// get user from signin
		const user = result.user;
		// set as non-admin and null board unless they are already set as anything
		if (!(await exists('users/' + user.uid))) {
			write('users/' + user.uid, {
				admin: false,
				board: 'null'
			});
		}
	});
};

// logout
export const logout = async () => {
	const logInButton = document.querySelector('#login');
	if (logInButton) {
		logInButton.classList.remove('success');
	}
	await auth.signOut();
};

export const createBoardDb = async (boardName: string) => {
	try {
		await write(`users/${auth.currentUser?.uid}/board`, boardName);
		await write(`taken/${boardName}`, true);
		await write(
			'boards/' + boardName,
			"This is your board!<br><br>Let the world know what you're up to by accessing the Admin Panel."
		);
	} catch (error) {
		await auth.signOut();
		window.location.href = '../unauthorized';
	}
};
