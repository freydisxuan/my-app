import logo from './logo.png'
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useState, useMemo, useEffect } from 'react';
import './App.css';
import React from 'react';

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [image, setImage] = useState(logo);
  const [color, setColor] = useState('#26de81');

  const typeColorMap = useMemo(() => {
    return {
      bug: "#abe0b3",
      dragon: "#ffeaa7",
      electric: "#fed330",
      fairy: "#ffadfc",
      fighting: "#30336b",
      fire: "#f0932b",
      flying: "#81ecec",
      grass: "#00b894",
      ground: "#EFB549",
      ghost: "#a55eea",
      ice: "#74b9ff",
      normal: "#95afc0",
      poison: "#6c5ce7",
      psychic: "#a29bfe",
      rock: "#2d3436",
      water: "#0190FF",
      dark: "#6A411C",
      steel:"#97A2B6",
    };
  }, []);

  useEffect(() => {
    generateRandom();
    // eslint recommends dependency that causes intfinite re-render :)
    // eslint-disable-next-line 
  }, []);

  const generateInfo = useMemo(() => {
    if (data.length === 0) {
      return;
    }
    const types = [];
    const abilities = [];
    if (data.types.length > 0) {
      data.types.forEach(t => {
        types.push(_.startCase(t.type.name));
      });
      console.log(typeColorMap[data.types[0].type.name]);
      setColor(typeColorMap[data.types[0].type.name]);
    }
    if (data.abilities.length > 0) {
      data.abilities.forEach(a => {
        abilities.push(_.startCase(a.ability.name.replace('-', ' ')));
      });
    }
    const typeTitle = types.length > 1 ? 'Types:' : 'Type:';
    const abilityTitle = abilities.length > 1 ? 'Abilities:' : 'Ability:';
    return (
       // eslint-disable-next-line
      <>
        <p className='poke-name'>{_.startCase(data.name.replace('-',' '))}</p>
        <p className='hp'>HP: {data.stats[0]['base_stat']}</p>
        {types.length > 0 && 
          <p className='types' style={{ backgroundColor: color, color: color === '#6A411C' || color === '#2d3436' || color === '#30336b' ? 'white' : 'black' }}>{typeTitle} {types.join(', ')} </p>
        }
        {abilities.length > 0 && 
          <p>{abilityTitle} {abilities.join(', ')}</p>
        }
       <section className='height-weight-container'>
        <p className='height'>Height: {data.height*10} cm</p>
        <p className='weight'>Weight: {data.weight/10} kg</p>
       </section>
      </>
    )
  }, [data, color, typeColorMap])
  

  const updateSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, [])

  const getData = useCallback((input = undefined) => {
    if (input === undefined || input === '') {
      alert('Please enter a Pokemon name');
      return;
    }
    axios.get(`https://pokeapi.co/api/v2/pokemon/${_.toLower(input.replace(' ', '-'))}`).then(res => {
      setSearch(_.startCase(res.data.name).replace('_', ' '));
      setData(res.data);
      setImage(res.data.sprites.other['official-artwork']['front_default']);
    }).catch(err => {
      if (err.code === 'ERR_BAD_REQUEST') {
        alert(`No Pokemon found with the name ${input}`);
      } else {
        alert(err);
      }
    })
  }, []);

  const generateRandom = useCallback(() => {
    const random = Math.floor(Math.random() * 1016) + 1;
    axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`).then(res => {
      setSearch(_.startCase(res.data.name).replace('_', ' '));
      setData(res.data);
      setImage(res.data.sprites.other['official-artwork']['front_default']);
    }).catch(err => {
      alert(err);
    })
  }, []);

  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokémon Search</h1>
        <div className='card' style={{ background: `radial-gradient(circle at 50% 0%, ${color} 36%, rgb(255, 255, 255) 36%)` }}>
          <img src={image} className="App-logo" alt="logo" />
          <div className="ButtonWrapper">
            <input type="text" spellCheck={false} value={search} onChange={(e) => updateSearch(e)} onKeyDown={(e) => e.key === 'Enter' && getData(search)} placeholder="Enter Pokémon Name"/>
            <button onClick={() => generateRandom()}>Generate Random Pokémon!</button>
          </div>
          <div className="InfoWrapper">
            {generateInfo}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
