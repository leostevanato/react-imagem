import { useRef, useState } from 'react';
import './App.css';

function App() {
  const [arquivoImagem, setArquivoImagem] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('selecionando');
  const imagemRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setStatus('enviando');

    try {
      await submitForm(arquivoImagem);
      setStatus('sucesso');
      setArquivoImagem('');
      imagemRef.current.value = null;
    } catch (err) {
      setStatus('selecionando');
      setError(err);
    }
  }

  function handleFileChange(e) {
    setError(null);
    setStatus('selecionando');

    setArquivoImagem(e.target.files[0] ?? '');
  }

  async function submitForm(arquivo) {
    return new Promise((resolve, reject) => {
      if (arquivo && (arquivo.name.length > 0 && arquivo.size > 0)) {
        const dadosForm = new FormData();

        dadosForm.append("arquivo", arquivo);
        
        fetch('http://localhost/react-imagem/public/upload.php', {
          method: 'POST',
          body: dadosForm
        })
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.error(err));
        
        resolve();
      } else {
        reject(new Error('Erro ao enviar o arquivo.'));
      }
    });
    
    /*
    // Pretend it's hitting the network.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let arquivoOk = arquivo && (arquivo.name.length > 0 && arquivo.size > 0);

        if (arquivoOk) {
          resolve();
        } else {
          reject(new Error('Erro ao enviar o arquivo.'));
        }
      }, 1000);
    });
    */
  }

  return (
    <>
      {status === 'sucesso' &&
        <p>
          <img src="vite.svg" alt="" />
        </p>
      }

      <form id="form-imagem" onSubmit={handleSubmit}>
        <label htmlFor="imagem" style={{ marginRight: "8px" }}>Selecione uma imagem:</label>

        <input type="file" name="imagem" id="imagem"
          ref={imagemRef}
          onInput={handleFileChange}
        />

        <p>
          <button id="enviar" type="submit"
            disabled={arquivoImagem.length === 0 || status === 'submitting'}
          >Enviar</button>
        </p>
      </form>

      {status === 'sucesso' &&
        <p className="sucesso" style={{ color: "blue" }}>
          Arquivo enviado com sucesso!
        </p>
      }

      {error !== null &&
        <p className="erro" style={{ color: "red" }}>
          {error.message}
        </p>
      }
    </>
  );
}

export default App;
