// pages/index.js

import Nav from '../components/nav';
import Search from '../pages/products/search_ui';
import Footer from '../components/footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Search />
      <Footer />
    </>
  );
}
