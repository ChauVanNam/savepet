import { getFirestore, collection, getDocs } from "firebase/firestore"
import { db } from "../../../../firebase.config"

const postColectionRef = collection(db, "post")

const getAllPosts = async () => {
  const data = await getDocs(postColectionRef)
  console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}
