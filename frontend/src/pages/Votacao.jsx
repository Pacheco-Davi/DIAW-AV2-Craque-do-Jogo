import { useState } from 'react';
import { Link } from 'react-router';
import JogadorCard from '../components/JogadorCard';
import { listarPorSituacao, obterSuspenso, registrarVoto } from '../services/votacaoService';

export default function Votacao() {
  const [selecionado, setSelecionado] = useState(null); 
  const [historico, setHistorico] = useState([]);       

  const indicados = listarPorSituacao('indicado');
  const elenco = listarPorSituacao('elenco');
  const suspenso = obterSuspenso();

  function handleConfirmar() {
    if (!selecionado) return;
    registrarVoto(selecionado.id);
    setHistorico([...historico, selecionado.nome]);
    setSelecionado(null);
  }

  const qtd = historico.length;

  return (
    <main className="pagina">
      <h1 className="titulo">Vote no Craque do Jogo</h1>
      <p className="subtitulo">Galo 3 x 1 · Arena MRV</p>

      <section className="grade-indicados">
        {indicados.map((jogador) => (
          <JogadorCard
            key={jogador.id}
            jogador={jogador}
            selecionado={selecionado?.id === jogador.id}
            onSelecionar={setSelecionado}
          />
        ))}
      </section>

      <div className="confirmacao">
        <p>
          {selecionado
            ? <>Seu voto vai para <strong>{selecionado.nome}</strong>.</>
            : 'Nenhum jogador selecionado.'}
        </p>
        <button className="btn-confirmar" disabled={!selecionado} onClick={handleConfirmar}>
          Confirmar voto
        </button>
      </div>

      {historico.length > 0 && (
        <section className="historico">
          <h2>Seus votos nesta sessão: {qtd} {qtd === 1 ? 'voto' : 'votos'}</h2>
          <ol>
            {historico.map((nome, i) => (
              <li key={i}>{nome}</li>
            ))}
          </ol>
          <Link to="/resultado" className="link-resultado">Ver resultado</Link>
        </section>
      )}

      <section className="secao-elenco">
        <h2>Fora da votação</h2>
        <div className="grade-elenco">
          {suspenso && <JogadorCard jogador={suspenso} />}
          {elenco.map((jogador) => (
            <JogadorCard key={jogador.id} jogador={jogador} />
          ))}
        </div>
      </section>
    </main>
  );
}
