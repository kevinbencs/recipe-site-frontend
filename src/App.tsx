import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Layout from './components/layout';
import Search from './pages/search';
import Category from './pages/category';
import Recipe from './pages/recipe';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Newpassword from './pages/newpassword';
import Forgotpassword from './pages/forgotpassword';
import ScrollTop from './components/scrolltop';
import { useLogged } from './components/userProvider';
import { HelmetProvider } from 'react-helmet-async';


function App() {
  const { userName } = useLogged()

  return (
    <BrowserRouter>
      <HelmetProvider>
        <ScrollTop />
        <Layout>
          <Routes>
            <Route path='*' element={<Navigate to='/' replace={false} />} />
            <Route path='/' element={<Home />} />
            <Route path='/search/:name' element={<Search />} />
            <Route path='/:category' element={<Category />} />
            <Route path='/:category/:name' element={<Recipe />} />
            {
              userName === '' &&
              <>
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgotpassword' element={<Forgotpassword />} />
              </>
            }
            {
              userName !== '' &&
              <Route path='/newpassword' element={<Newpassword />} />
            }

          </Routes>
        </Layout>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
