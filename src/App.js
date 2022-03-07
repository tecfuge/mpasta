import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AuthProvider from "Contexts/auth";
import OrderProvider from "Contexts/order";
import GlobalProvider from "Contexts/global";
import Navbar from "Components/Common/Navbar";
import Footer from "Components/Common/Footer";
import Home from "Components/Home";
import List from "Components/List";
import Offer from "Components/Offer";
import Checkout from "Components/Checkout";
import NotFound from "Components/404";
import ScrollToTop from "Hooks/scrollToTop";
import About from "Components/About";
import Contact from "Components/Contact";
import Privacy from "Components/Privacy";
import Terms from "Components/Terms";
import Payment from "Components/Payment";
import ResetPassword from "Components/Common/ResetPassword";
import Tracker from "Components/Tracker";
import OrderHistory from "Components/History";
import Stores from "Components/Stores";

const withTemplate = (Component) => (
  <>
    <Navbar />
    <Component />
    <Footer />
  </>
);

const App = () => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <Router basename={process.env.REACT_APP_ROUTE_BASE_PATH}>
          {/* Scroll page to the top, on page navigation */}
          <ScrollToTop />         
          <Switch>
            <Route exact path="/" render={() => withTemplate(Home)} />
            {/* Only menu selection page & checkout page use order context for showing cart */}
            <OrderProvider>
              <Route path="/menu" render={() => withTemplate(List)} />
              <Route path="/deals" render={() => withTemplate(Offer)} />
              <Route path="/tracker" render={() => withTemplate(Tracker)} />
              <Route path="/myorders" render={() => withTemplate(OrderHistory)} />
              <Route path="/checkout" render={() => withTemplate(Checkout)} />
              <Route path="/about" render={() => withTemplate(About)}/>
              <Route path="/contact" render={() => withTemplate(Contact)}/>
              <Route path="/privacy" render={() => withTemplate(Privacy)} />
              <Route path="/terms" render={() => withTemplate(Terms)} /> 
              <Route path="/paymentstatus" component={Payment} />
              <Route path="/resetpassword" render={() => withTemplate(ResetPassword)} />
              <Route path="/stores" render={() => withTemplate(Stores)} /> 
            </OrderProvider>
            <Route render={() => withTemplate(NotFound)} />
          </Switch>          
        </Router>
      </AuthProvider>
    </GlobalProvider>
  );
};

export default App;