import logo from './logo.png'
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useState, useMemo, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [image, setImage] = useState(logo);

  // const typeColor = {
  //   bug: "#26de81",
  //   dragon: "#ffeaa7",
  //   electric: "#fed330",
  //   fairy: "#FF0069",
  //   fighting: "#30336b",
  //   fire: "#f0932b",
  //   flying: "#81ecec",
  //   grass: "#00b894",
  //   ground: "#EFB549",
  //   ghost: "#a55eea",
  //   ice: "#74b9ff",
  //   normal: "#95afc0",
  //   poison: "#6c5ce7",
  //   psychic: "#a29bfe",
  //   rock: "#2d3436",
  //   water: "#0190FF",
  // };

  useEffect(() => {
    generateRandom();
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
    }
    if (data.abilities.length > 0) {
      data.abilities.forEach(a => {
        abilities.push(_.startCase(a.ability.name.replace('-', ' ')));
      });
    }
    const typeTitle = types.length > 1 ? 'Types:' : 'Type:';
    const abilityTitle = abilities.length > 1 ? 'Abilities:' : 'Ability:';
    // const themeColor = typeColor[data.types[0].type.name];
    return (
      <>
        <p className='poke-name'>{data.name[0].toUpperCase() + data.name.slice(1)}</p>
        <p className='hp'>HP: {data.stats[0]['base_stat']}</p>
        {types.length > 0 && 
          <p className='types'>{typeTitle} {types.join(', ')}</p>
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
  }, [data])
  

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
  }, [data]);

  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokémon search</h1>
        <div className='card'>
        <img src={image} className="App-logo" alt="logo" />
        <div className="ButtonWrapper">
          <input type="text" value={search} onChange={(e) => updateSearch(e)} onKeyDown={(e) => e.key === 'Enter' && getData(search)} placeholder="Enter Pokémon name"/>
          <button onClick={() => generateRandom()}>Generate random pokémon!</button>
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
