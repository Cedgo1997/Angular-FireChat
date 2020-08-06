import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

import { map } from "rxjs/operators";
import { Mensaje } from "./../interfaces/mensaje.interface";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      console.log(user);
      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    if (proveedor === "google") {
      this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }

    if(proveedor === 'twitter') {
      this.auth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.auth.auth.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>("chats", (ref) =>
      ref.orderBy("fecha", "desc").limit(10)
    );

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        console.log(mensajes);

        this.chats = [];

        for (let mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;
      })
    );
  }

  // TODO falta UUID del usuario

  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
    };

    return this.itemsCollection.add(mensaje);
  }
}
