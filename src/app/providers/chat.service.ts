import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Mensaje } from "./../interfaces/mensaje.interface";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];

  constructor(private afs: AngularFirestore) {}

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>("chats", ref => ref.orderBy('fecha', 'desc').limit(10));

    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        console.log(mensajes);

        this.chats = [];

        for(let mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;
      })
    );
  }

  // TODO falta UUID del usuario

  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: "César Demo",
      mensaje: texto,
      fecha: new Date().getTime(),
    };

    return this.itemsCollection.add( mensaje );
  }
}
