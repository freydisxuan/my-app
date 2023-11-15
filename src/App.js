import logo from './logo.png'
import axios from 'axios';
import _ from 'lodash';
import { useCallback, useState, useMemo, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [image, setImage] = useState(logo);

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
    return (
      <>
        <p>Hp: {data.stats[0]['base_stat']}</p>
        {types.length > 0 && 
          <p>{typeTitle} {types.join(', ')}</p>
        }
        {abilities.length > 0 && 
          <p>{abilityTitle} {abilities.join(', ')}</p>
        }
        <p>Height: {data.height*10} cm</p>
        <p>Weight: {data.weight/10} kg</p>
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
        <img src={image} className="App-logo" alt="logo" />
        <div className="ButtonWrapper">
          <input type="text" value={search} onChange={(e) => updateSearch(e)} onKeyDown={(e) => e.key === 'Enter' && getData(search)} />
          <button onClick={() => generateRandom()}>Random</button>
        </div>
        <div className="InfoWrapper">
          {generateInfo}
        </div>
      </header>
    </div>
  );
}

export default App;
