import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'

const FirebaseContxt = createContext({
  firebase: null,
  getFirebase: async () => null,
})

// const firebaseConfig = {
//     apiKey: process.env.PRIVATE_KEY,
//     authDomain: process.env.AUTH_URI,
//     // databaseURL: process.env.FIREBASE_DATABASE_URL,
//     projectId: process.env.PROJECT_ID,
//     // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     // messagingSenderId: process.env.FIREBASE_MESSAGEING_SENDER_ID,
//     // appId: process.env.FIREBASE_APP_ID
//   };

const initialize = async () => {
  if (typeof window === 'undefined') return

//   await Promise.all([
//       // 必要に応じて追加する
//       import('firebase/auth'),
//       import('firebase/firestore'),
//       import('firebase/storage'),
//     ])

//   firebase.initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG))
  firebase.initializeApp(firebaseConfig)
  // モジュールごとの初期化
  // firebase.analytics()

  return firebase
}

const promise = initialize()

const FirebaseContxtProvider = ({ children }) => {
  const [firebase, setFirebase] = useState(null)

  useEffect(() => {
    ;(async () => {
      setFirebase(await promise)
    })()
  }, [])

  return (
    <FirebaseContxt.Provider value={{ firebase, getFirebase: () => promise }}>
      {children}
    </FirebaseContxt.Provider>
  )
}

export default FirebaseContxt
export { FirebaseContxtProvider }