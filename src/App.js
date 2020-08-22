import React, { useReducer, useEffect } from "react";

import { Container, Col, Row } from "reactstrap";

// react-router-dom3
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// react toastify stuffs
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// firebase stuffs
//TODO: DONE import firebase config and firebase database
import { firebaseConfig } from "./utils/config";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

// components
import AddContact from "./pages/AddContact";
import Contacts from "./pages/Contacts";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ViewContact from "./pages/ViewContact";
import PageNotFound from "./pages/PageNotFound";

// context api stuffs
//TODO: DONE  import reducers and contexts
import reducer from "./context/reducer";
import { ContactContext } from "./context/Context";
import { SET_CONTACT, SET_LOADING } from "./context/action.types";

//initlizeing firebase app with the firebase config which are in ./utils/firebaseConfig
//TODO:DONE  initialize FIREBASE
firebase.initializeApp(firebaseConfig);

// first state to provide in react reducer
const initialState = {
  contacts: [],
  contact: {},
  contactToUpdate: null,
  contactToUpdateKey: null,
  isLoading: false
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // will get contacts from firebase and set it on state contacts array
  const getContacts = async () => {
    // TODO: load existing data
    dispatch({
      type: SET_LOADING,
      payload: true
    });

    const contactsRef = await firebase.database().ref("/contacts");
    contactsRef.on("value", snapshot => {
      dispatch({
        type: SET_CONTACT,
        payload: snapshot.val()
      });
      dispatch({
        type: SET_LOADING,
        payload: false
      });
    });
  };

  // getting contact  when component did mount
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <Router>
      <ContactContext.Provider value={{ state, dispatch }}>
        <ToastContainer />
        <Header />
        <Container>
          <Switch>
            <Route exact path="/contact/add" component={AddContact} />
            <Route exact path="/contact/view" component={ViewContact} />
            <Route exact path="/" component={Contacts} />
            <Route exact path="*" component={PageNotFound} />
          </Switch>
        </Container>

        <Footer />
      </ContactContext.Provider>
    </Router>
  );
};

export default App;

/*
You have to install: npm install axios bootstrap browser-image-resizer firebase 
react-icons react-router-dom react-toastify reactstrap uuid
While you are creating a database in firebase(leftside *Database*),
Click on RealtimeDatabase, 
1)Start in locked mode, (If you are making a production use this, (third party can't use or change this))
2)Start in test mode, (If you are practising, you can use this, (third party can use it)) (It is used here)
*Make sure if you are doing any production*
You can also change the rules by clicking in rules section and can change to true or false
You have to even create Storage (leftside *Storage*)
Then, select Get Started
then, Select next
then, select the cloud storage location (location which is nearest to you)
It will create a default bucket
After creating, go to Rules,
Check whether do you this code: : if request.auth != null;
If it's there it is safe, and it can be used for production
And you can remove the above code but it is not safe. (For this file I have removed the code)
In utils/config.js, it is about image browser-image-resizer
Files:
1)context
  a)context/Context.js
  b)context/action.types.js
  c)context/reducer.js
2)layout
  a)layout/Header.js
  b)layout/Footer.js  
Adding Google maps it is in ViewContact which is inside
*/
