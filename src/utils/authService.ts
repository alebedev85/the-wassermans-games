import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

// export const register = async (email: string, password: string) => {
//   const auth = getAuth();
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   return userCredential.user;
// };

export const login = async (email: string, password: string) => {
  const auth = getAuth();
  const {user} = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return {
    id: user.uid,
    email: user.email,
    token: await user.getIdToken(),
  };
};

export const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
};
