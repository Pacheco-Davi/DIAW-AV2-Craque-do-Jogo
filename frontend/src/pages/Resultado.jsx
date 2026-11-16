import { useState } from 'react';
import { Link } from 'react-router';
import {
  obterVotos,
  calcularResultado,
  desfazerUltimoVoto,
  zerarVotacao,
} from '../services/votacaoService';

const plural = (n) => `${n} ${n === 1 ? 'voto' : 'votos'}`;

export default function Resultado() {
  // Função no useState: lê o localStorage só na primeira renderização
  const [votos, setVotos] = useState(() => obterVotos());

  // Valores derivados: recalculados a cada renderização, sem useState extra
  const total = votos.length;
  const resultado = calcularResultado(votos);
  const [primeiro, segundo] = resultado;
  const vantagem = primeiro && segundo ? primeiro.votos - segundo.votos : 0;

  function handleDesfazer() {
    setVotos(desfazerUltimoVoto());
  }

  function handleZerar() {
    if (window.confirm('Tem certeza que deseja zerar toda a votação?')) {
      zerarVotacao();
      setVotos([]);
    }
  }

  return (
    <main className="pagina">
      <h1 className="titulo">Resultado</h1>

      {total === 0 ? (
        <div className="vazio">
          <p>Nenhum voto registrado ainda.</p>
          <Link to="/votacao" className="link-resultado">Ir para a votação</Link>
        </div>
      ) : (
        <>
          <p className="total">Total: {plural(total)}</p>

          <p className="disputa">
            {vantagem === 0
              ? `Empate na liderança entre ${primeiro.nome} e ${segundo.nome}!`
              : `${primeiro.nome} lidera com ${plural(vantagem)} de vantagem sobre ${segundo.nome}.`}
          </p>

          <ol className="placar">
            {resultado.map((j, index) => {
              const destaque =
                index === 0 ? 'placar-craque' : index === 1 ? 'placar-vice' : '';
              return (
                <li key={j.id} className={`placar-item ${destaque}`}>
                  <div className="placar-topo">
                    <span className="placar-posicao">{index + 1}º</span>
                    <img className="placar-foto" src={j.foto} alt={j.nome} />
                    <span className="placar-nome">{j.nome}</span>
                    {index === 0 && <span className="selo-placar">Craque do jogo</span>}
                    {index === 1 && <span className="selo-placar">Vice</span>}
                    <span className="placar-numeros">
                      {plural(j.votos)} ·{' '}
                      {j.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                  <div className="barra">
                    <div className="barra-preenchida" style={{ width: `${j.percentual}%` }} />
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="acoes">
            <button onClick={handleDesfazer}>Desfazer último voto</button>
            <button className="btn-perigo" onClick={handleZerar}>Zerar votação</button>
          </div>
        </>
      )}
    </main>
  );
}
