import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const uploadsDir = 'uploads/';
  const [imagemLoading, setImagemLoading] = useState(true);
  const [imagemSrc, setImagemSrc] = useState('');
  const [imagemList, setImagemList] = useState([]);
  const [arquivoImagem, setArquivoImagem] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('selecionando');
  const inputImagemRef = useRef(null);

  async function carregarListaImagens() {
    try {
      const response = await fetch('http://localhost/react-imagem/public/listar_uploads.php');
      const result = await response.json();

      if (!result) {
        throw false;
      }

      setImagemSrc(result[0]);
      setImagemList(result);
      setImagemLoading(false);
    } catch (error) {
      throw new Error('Erro ao carregar imagens.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setImagemLoading(true);
    setError(null);
    setStatus('enviando');

    try {
      await submitForm(arquivoImagem);
      setStatus('sucesso');
      setArquivoImagem('');
      inputImagemRef.current.value = null;
    } catch (err) {
      setStatus('selecionando');
      setError(err);
    }
  }

  const trocarImagem = (e) => {
    e.preventDefault();

    setStatus('selecionando');
    setError(null);
    setImagemLoading(true);
    setImagemSrc(imagemList.find((imagem) => imagem === e.target.text));
  }

  function handleFileInputChange(e) {
    setError(null);
    setStatus('selecionando');

    setArquivoImagem(e.target.files[0] ?? '');
  }

  async function submitForm(arquivo) {
    if (arquivo && (arquivo.name.length > 0 && arquivo.size > 0)) {
      try {
        const dadosForm = new FormData();

        dadosForm.append("arquivo", arquivo);

        const response = await fetch('http://localhost/react-imagem/public/upload.php', {
          method: 'POST',
          body: dadosForm
        });

        const result = await response.json();

        if (!result) {
          throw false;
        }

        setImagemSrc(result);
      } catch (error) {
        throw new Error('Erro ao enviar o arquivo.');
      }
    } else {
      throw new Error('O arquivo parece estar com problema.');
    }
  }

  useEffect(() => {
    carregarListaImagens();
  }, []);

  return (
    <>
      <h2 style={{ display: imagemLoading ? "block" : "none" }}>🌀 Carregando imagem...</h2>
      
      <p style={{ width: "300px", height: "auto", margin: "auto", display: !imagemLoading && imagemSrc.length > 0 ? "block" : "none" }}>
            <img
              style={{ borderRadius: "1rem" }}
              onLoad={() => setImagemLoading(false)}
              src={uploadsDir + imagemSrc}
              alt=""
              width="300"
            />
      </p>
      
      <h2 style={{ display: !imagemLoading && imagemSrc.length <= 0 ? "block" : "none" }}>Imagem não carregada.</h2>

      <form id="form-imagem" onSubmit={handleSubmit}>
        <label htmlFor="imagem-input" style={{ marginRight: "8px" }}>Selecione uma imagem:</label>

        <input type="file" name="imagem-input" id="imagem-input"
          ref={inputImagemRef}
          onInput={handleFileInputChange}
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

      {imagemList.length > 0 &&
        <ul style={{ textAlign: 'left' }}>
          {imagemList.map((img, index) => {
            if (imagemSrc !== img) {
              return <li key={index}><a href="#" onClick={trocarImagem}>{img}</a></li>
            }
          })}
        </ul>
      }
    </>
  );
}

export default App;
