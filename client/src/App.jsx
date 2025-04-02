import { BrowserRouter as Router } from 'react-router-dom';

import Footer from './Components/Footer';
import Header from './Components/Header';

import RouterApp from './routes';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <RouterApp />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
