import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

            import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

  
  // Your web app's Firebase configuration
            const firebaseConfig = {
    apiKey: "AIzaSyDJj-ec84obLPTDHMVy9MbgnwkkSFlOhv0",
    authDomain: "t2--chats.firebaseapp.com",
    databaseURL: "https://t2--chats-default-rtdb.firebaseio.com",
    projectId: "t2--chats",
    storageBucket: "t2--chats.appspot.com",
    messagingSenderId: "537340226267",
    appId: "1:537340226267:web:a98ac6eda069b32913bafe"
  };

  // Initialize Firebase
            const app = initializeApp(firebaseConfig);

   //get ref to database services
             const db = getDatabase(app);

             document.getElementById("submit").addEventListener('click', function(e){
              e.preventDefault();
              set(ref(db, 'user/' + document.getElementById("username").value),
              {
   
                username: document.getElementById("username").value,
                
                PhoneNumber: document.getElementById("phone").value,
                text: document.getElementById("textbox").value

              });
                alert("Thanks to use and advice share !");
             })