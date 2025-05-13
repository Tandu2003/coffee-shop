import { BrowserRouter as Router } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';
import ChatBot from './Components/ChatBot';
import { ProductProvider } from './Context/ProductProvider';

import RouterApp from './routes';

function App() {
  return (
    <div className="App">
      <Router>
        <ProductProvider>
          <Header />
          <RouterApp />
          <Footer />
          <ChatBot />
        </ProductProvider>
      </Router>
    </div>
  );
}

export default App;
