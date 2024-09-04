// src/pages/Home.tsx
import React from 'react';
import ParcelaList from '../components/ParcelaList';
import Menu from '../components/Menu';

const Home: React.FC = () => (
  <div className="d-flex">
    <div className="col-md-3">
      <Menu />
    </div>
    <div className="col-md-9">
      <ParcelaList />
    </div>
  </div>
);

export default Home;
