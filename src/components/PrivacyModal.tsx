import { useRef } from 'react'

export function PrivacyModal() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        className="privacy-trigger"
        onClick={() => dialogRef.current?.showModal()}
      >
        🔒 Nada do que digitas é guardado — saber mais
      </button>
      <dialog
        ref={dialogRef}
        className="modal-dialog"
        aria-labelledby="privacy-modal-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close()
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="privacy-modal-title">Os teus dados não saem daqui</h2>
            <button
              type="button"
              className="modal-close"
              aria-label="Fechar"
              onClick={() => dialogRef.current?.close()}
            >
              ✕
            </button>
          </div>
          <ul className="privacy-list">
            <li>
              <strong>Tudo corre no teu navegador.</strong> Não há servidor, base de
              dados nem contas — os valores que digitas (tarifa, salário, ajudas)
              nunca são guardados nem enviados para lado nenhum.
            </li>
            <li>
              <strong>Sem cookies, sem tracking pessoal.</strong> Usamos apenas o
              Vercel Analytics para uma contagem anónima de visitas à página — sem
              cookies, sem dados pessoais e sem acesso a nada do que preencheres.
            </li>
            <li>
              <strong>Fechaste a página? Desapareceu tudo.</strong> Cada visita
              começa do zero.
            </li>
          </ul>
          <p className="privacy-source">
            O código é aberto — podes confirmar tudo no{' '}
            <a
              href="https://github.com/renatoruis/quantosobra"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </dialog>
    </>
  )
}
