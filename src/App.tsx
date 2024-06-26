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
import { useEffect, useState } from 'react';

function App() {
  const [account, setAccount] = useState<string>('undefined');

  useEffect(() => {
    const getAccount = async() => {
      await fetch('/getaccount',{
        method:"GET",
        headers: {
          "Accept": "application/json, text/plain",
          "Content": "apllication/json"
        }
      })
      .then(data => data.json())
      .then(res => {
        setAccount(res.name);
      })
    }
    getAccount();
  },[])

  return (
    <BrowserRouter>
      <ScrollTop />
      <Layout account={account} setAccount={setAccount}>
        <Routes>
          <Route path='*' element={<Navigate to='/' replace={false} />} />
          <Route path='/' element={<Home />} />
          <Route path='/search/:name' element={<Search />} />
          <Route path='/:category' element={<Category />} />
          <Route path='/:category/:name' element={<Recipe account={account}/>} />
          {
            account === 'undefined' &&
            <>
              <Route path='/signin' element={<Signin setAccount={setAccount} />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/forgotpassword' element={<Forgotpassword />} />
            </>
          }
          {
            account !== 'undefined' &&
            <Route path='/newpassword' element={<Newpassword />} />
          }
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
