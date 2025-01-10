import { Auth, FirebaseOauth2Background, User } from '@dhruv-techapps/firebase-oauth';
import { Firestore, Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, where } from 'firebase/firestore';
import { ConfigRequest } from './firebase-firestore.types';

export class FirebaseFirestoreBackground extends FirebaseOauth2Background {
  db: Firestore;
  publicUrl?: string;
  user: User | null = null;

  constructor(auth: Auth, edgeClientId?: string, publicUrl?: string) {
    super(auth, edgeClientId);
    this.db = getFirestore(auth.app);
    this.publicUrl = publicUrl;
  }

  async getProducts() {
    const productsQuery = query(collection(this.db, 'products'), where('active', '==', true), orderBy('metadata.order'));

    const querySnapshot = await getDocs(productsQuery);
    const products: { prices: { id: string }[]; id: string }[] = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const product = { id: doc.id, ...doc.data(), prices: [] as { id: string }[] };
        const priceQuery = query(collection(doc.ref, 'prices'), where('active', '==', true));
        const priceSnap = await getDocs(priceQuery);
        priceSnap.docs.forEach((doc) => {
          product.prices.push({ id: doc.id, ...doc.data() });
        });
        products.push(product);
      })
    );

    return products;
  }

  async getSubscriptions() {
    const user = this.auth.currentUser;
    if (!user) {
      return null;
    }
    const subscriptionsRef = query(collection(this.db, 'customers', user.uid, 'subscriptions'), where('status', 'in', ['trialing', 'active']));
    const subscriptionsSnapshot = await getDocs(subscriptionsRef);
    const subscriptions: { id: string }[] = [];
    if (!subscriptionsSnapshot.empty) {
      subscriptionsSnapshot.forEach((doc) => {
        const subscription = { id: doc.id, ...doc.data() };
        subscriptions.push(subscription);
      });
      return subscriptions;
    }
    return null;
  }

  async subscribe(priceId: string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Please login to subscribe');
    }

    const checkoutSessionsRef = query(collection(this.db, 'customers', user.uid, 'checkout_sessions'), where('price', '==', priceId));
    const checkoutSessions = await getDocs(checkoutSessionsRef);
    if (!checkoutSessions.empty) {
      checkoutSessions.forEach((doc) => {
        const data = doc.data();
        if (data['url']) {
          return data['url'] as string;
        } else {
          throw new Error(data['error'].message);
        }
      });
    }

    const checkoutSessionRef = await addDoc(collection(this.db, 'customers', user.uid, 'checkout_sessions'), {
      mode: 'subscription',
      price: priceId,
      allow_promotion_codes: true,
      success_url: this.publicUrl,
      cancel_url: this.publicUrl,
    });

    const docSnap = await getDoc(checkoutSessionRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.['error']) {
        throw new Error(data['error'].message);
      }
      if (data?.['url']) {
        return data?.['url'] as string;
      }
    }
    throw new Error('Something went wrong');
  }

  async setDiscord(discord: unknown) {
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const docRef = doc(this.db, `users/${user.uid}`);
    await setDoc(docRef, { discord }, { merge: true });
  }

  async getDiscord() {
    await this.auth.authStateReady();
    const docRef = doc(this.db, `users/${this.auth.currentUser?.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data['discord']) {
        return data['discord'];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  async setProfile(profile: boolean) {
    await this.auth.authStateReady();
    const docRef = doc(this.db, `users/${this.auth.currentUser?.uid}`);
    const result = await setDoc(docRef, { publicProfile: profile, userName: this.auth.currentUser?.displayName }, { merge: true });
    return result;
  }

  async getProfile(): Promise<boolean> {
    await this.auth.authStateReady();
    const docRef = doc(this.db, `users/${this.auth.currentUser?.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.['publicProfile']) {
        return data['publicProfile'];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async setConfig(config: ConfigRequest, id: string) {
    await this.auth.authStateReady();
    const docRef = doc(this.db, `configurations/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      config.updated = Timestamp.fromDate(new Date());
    } else {
      config.created = Timestamp.fromDate(new Date());
    }
    await setDoc(docRef, config, { merge: true });
  }
}
