import React, { useEffect, useState } from 'react';

import './global.css'
import './App.css'
import './SideBar.css'
import './Main.css'
import api from './services/api'
import DevItem from './components/Devitem'


// useState - Função para criar um estado.
// Propriedade - Informações que um componente pai passa para um componente filho.
// Estado - Informações mantidas pelos componentes.
// Componente - Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação.

// Fragment <> </>

// Programação declarativa: declara oq quer que o algoritmo faça
// Programação imperativa: o componente precisa se comportar baseado no estado
function App() {
  const [github_username, setGithubUsername] = useState('')
  const [techs, setTechs] = useState('')
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

      },
      (err) => {
        console.log(err)
      },
      {
        timeout: 30000,
      }
    )
  }, [])

  async function loadDevs() {
    const { data } = await api.get('/devs')
    setDevs(data)
  }

  useEffect(() => {
    loadDevs();
  }, [])



  async function handleAddDev(e) {
    e.preventDefault();

    await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    })
    
    loadDevs();
    setGithubUsername('');
    setTechs('');
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input onChange={e => setGithubUsername(e.target.value)} value={github_username} name="github_username" id="github_username" required />
          </div>

          <div className="input-block">
            <label htmlFor="techs"> Tecnologias</label>
            <input onChange={e => setTechs(e.target.value)} value={techs} name="techs" id="techs" required />
          </div>

          <div className="input-group">

            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input onChange={e => setLatitude(e.target.value)} type="number" name="latitude" id="latitude" value={latitude} required />
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input onChange={e => setLongitude(e.target.value)} type="number" name="longitude" id="longitude" value={longitude} required />
            </div>

          </div>
          <button type="submit">Salvar</button>
        </form>

      </aside>

      <main>
        <ul>
          {
            devs.map(dev => (
              <DevItem key={dev._id} dev = {dev}/>
            ))
          }
        </ul>
      </main>
    </div>
  );
}

export default App;
