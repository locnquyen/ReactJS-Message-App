import React, {useEffect, useState} from 'react';
import { app, db } from './../firebase/config';
import { collection, onSnapshot, query, where, orderBy, limit} from "firebase/firestore";

export const useFireStore = (col, condition) => {

    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        //const collectionRef = collection(db, collection);

        // conditions
        // {
        //     fieldName: 'acb',
        //     operator: "==",
        //     compareValue: 'acb'
        // }
        
        
        // if(condition){
        //     if(!condition.compareValue || !condition.compareValue.length){
        //         return;
        //     }
        //     collectionRef.where(condition.fieldName, condition.operator, condition.compareValue)
        // }

        // const unSubscribe = onSnapshot(collectionRef, snapshot => {
        //     const documents = snapshot.docs.map( doc => ({
        //         ...doc.data( ),
        //         id: doc.id
        //     }))
        //     setDocuments(documents);
        // })

        if(condition){
            if(!condition.compareValue || !condition.compareValue.length){
                setDocuments([])
                return;
            }
        }
        const q = query(collection(db, col), //col == rooms
        where(condition.fieldName, condition.operator, condition.compareValue),
        orderBy('createAt'),limit(100));

        const unSubscribe = onSnapshot(q, snapshot => {
            const docs = []
            snapshot.forEach(doc => {
                console.log("data",doc.data())
                docs.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            console.log("docs",docs);
            const doc = snapshot.docChanges().map(change => ({
                ...change.doc.data(),
                id: change.doc.id
            }))
            console.log("doc",doc);
            console.log("documents",documents);

            setDocuments(docs);
        })
        return unSubscribe;

        // const unsubscribe = onSnapshot(collection(db, "rooms"), (snap) => {
        //     const data = snap.docs.map( doc => ({
        //         ...doc.data(),
        //         id : doc.id
        //     }))
        //     console.log(data)
        //     return data;
        //   });

    }, [col, condition]);

  return documents
}
