var admin = require("firebase-admin");

export default async function(changes) {
    var serviceAccount = {
        type: "service_account",
        project_id: process.env.project_id,
        private_key_id: process.env.private_key_id,
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCJxgq3C0PJOjag\nfzFHnqfkZBLKpV1Dr8CK+8J/NtpWrZQuLuAFXnRBc0PdcXVzRebMHqQhTPMUvSbN\nwlUKdSFJW4CIk1A/xHXpO8WfpuwQqpj/WO4XYTamTo3xKvQACSzGr+I1biYzCiLI\nN67hkDA8QjdLoy/yCLWgo8hI/sYbqtE7KPOYrBnpI0qaARXfkz71Gw7U3Z/NgDGC\nuCCnz+EpRnxcQykdmODoF66rmU+ibCyc1tluhWo7q3FiQxHDY5tjLJeO8B7jiHUG\nemDVFjXn2Df81lAcN+SGLIxgN2Ih5Iid6SFm/XuWoypTAUSP+CLn+5FJvFgEGXb0\nFjxUok53AgMBAAECggEAIiMSe5lMcfs9FtZ9MOhEZGhRaanAqqlNFYLdBeVjAzAe\nM7VEp7/oIWF8ks1ukyHiVnhPJbspzd0yVLBOnvk3xrPn7K9Hpo04xBId3Pmgq16B\n618vG1bokhuLuxJwA+RCFnb1H1UMHQBpbt+xMs2lzgCAL/sewaNb0ZJTaZbLIoZ7\nHh170pZTYTnYibQgtJ+WQ8MingPZzqigmnXsLnRuY6b3uXqFYR25LwgOxfvF5fbN\nTHqzt7M7kgZDEd3XkD0Nn9czVTj+RlnNInq0AC3frjfXJ+Y63BhbCasGpwCh4h7J\ntYuEYks8aRqRUXMz3meuLWkI3Tg6LrbOmEBL2gUqXQKBgQC+x40qu+P5+GiQ5vz5\n/5F7H+TCxdkn/4eE4t0OfZT6IIzrVMhfKoue7/RY9nU0nUAvs7GY7htiNr1UzoVl\naa0izW1s2FW47/C3Uj6+/aJa8y1hUvktRIDj2IkN1Y71m1/9e7MnDwWRdTSfRoon\nc0ZfYVffhtMFCjXfSbYhap5w8wKBgQC435LUwYmX6UTcsF1rR4XuwWWmMVSas0Q5\nVWWwvTqlEm40MKFcNQLM/zBmMHI/JFgOCvglKqlGuHLoGe0WbIrP4KAZY4Y4FfGH\n5Maj8rZUpPOGand2qPfdm9C4E1gIN3YhC7HiUhwdnR3R11Y/HZGN+IXAl5yEwUr3\nceQgpcitbQKBgEMgDVBy6aTjPU92pp4DyRlMQH4zhNOo+fLMq8DUeN2FJHAM1a9+\nVb/nZ88BcH3BsnrWO++2H5Zv8i/rtk3XX9617wF0IL1AVy75VjB3J2/eziHHQvsl\ndkA0yQxADtvl/mE+6+sbQvdKCOjdtfBpg+I9auCwHIFSdWAKHHYngHX3AoGBAIah\nWh5R6s+T8q/8R6vOZDyg3lOO7RvTnMVb6TgyNbjsmRCssXWirS14UVi5wxk0cGOZ\nnWgDj06PGC7qYnvIA7aq0CxtC9tgL4pVEktmf11Y2ndypRjmp8rco7zJaXxiV0Zt\na9dzEEKInqSn+ojwEYWgDFdakYMj+GIGsKkN0fxpAoGBAIb6qlEKbyS+TEKJJQ2Y\nhDNYcEeALyxENsVfbuQ2MEJbysUgFwUpTVrRjo00o4H8u5EhyIygR0KoVXnD/Tfg\nKbzXuvKUI32FjztcuvT9azzFR3fRqfy9AKAPpTPNKtGWz/H+oCweWPsisfauBdiO\neUQumNg+AqQ/JWvKDdwZ50xf\n-----END PRIVATE KEY-----\n",
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        auth_uri: process.env.auth_uri,
        token_uri: process.env.token_uri,
        auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
        client_x509_cert_url:process.env.client_x509_cert_url
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://pushnotificaiton-1362e.firebaseio.com"
    });

    if (changes.document.token) {
        var message = {
            notification: {
                title: changes.document.title,
                body: changes.document.body,
                image: changes.document.image
            },
            token: changes.document.token
        };

        admin
            .messaging()
            .send(message)
            .then(response => {
                console.log("Successfully sent message:", response);
            })
            .catch(error => {
                console.log("Error sending message:", error);
            });
    }

    if (changes.document.topic) {
        var message = {
            notification: {
                title: changes.document.title,
                body: changes.document.body
            },
            topic: changes.document.topic
        };

        // Send a message to devices subscribed to the provided topic.
        admin
            .messaging()
            .send(message)
            .then(response => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
            })
            .catch(error => {
                console.log("Error sending message:", error);
            });
    }

    // ----- MULTIPLE MESSAGE ------
    // admin
    //     .messaging()
    //     .sendMulticast(message)
    //     .then(response => {
    //         console.log("Successfully sent message:", response);
    //     })
    //     .catch(error => {
    //         console.log("Error sending message:", error);
    //     });
}

