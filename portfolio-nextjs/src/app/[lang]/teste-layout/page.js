import Image from "next/image";

export default function ProjectDetailWireframe() {
  return (
    <main className="relative bg-white font-sans">

      {/* WRAPPER DE REVEAL (Hero + Imagem) */}
      {/* Mecânica de Parallax Dinâmico: A altura do container é exatamente a altura do Hero responsivo + 100vh.
          Isso garante que a imagem comece a subir no PIXEL EXATO em que o box de texto sair da tela. */}
      <div className="relative w-full bg-gray-900">
        
        {/* IMAGEM FIXA (Fica grudada no topo enquanto o container tiver espaço para rolar) */}
        <div className="sticky top-0 z-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
          <Image 
            src="/panF.jpg" 
            alt="Identidade Visual PAN e SISPAN" 
            fill 
            className="object-contain md:object-cover" 
            priority
            unoptimized
          />
        </div>

        {/* HERO BRANCO (Rola no fluxo normal do documento)
            O mt-[-100vh] puxa ele pro topo inicial, cobrindo a tela toda visualmente. 
            Como é um box flexível, não importa quantas linhas o celular/desktop exija, ele não quebra a regra. */}
        <section className="relative z-20 mt-[-100vh] flex w-full flex-col justify-center bg-white px-6 py-[200px] md:px-12 lg:px-24 shadow-md">
          <h1 className="type-h1 text-text-dark">
            Identidade Visual PAN e SISPAN
          </h1>
          <h3 className="mt-8 max-w-4xl type-h3 text-[var(--color-text-gray)]">
            A criação da Identidade Visual dos Planos de Ação Nacional (PAN) e do seu Sistema de informação (SISPAN) foi viabilizada pelo programa Pró-espécies da WWF, contou com uma equipe multidiplinar de designers, ilustradores e biólogos, além da colaboração da equipe de coordenação e gestão do ICMBio, tornando o processo de desenvolvimento plural e multidiciplinar.
          </h3>
        </section>

        {/* SPACER FANTASMA (100vh)
            Ele devolve ao fluxo do DOM exatamente a altura que retiramos no margin acima. 
            Resultado: o container Wrapper ganha exatamente a Altura do Hero + 100vh. Matemática imperdoável. */}
        <div className="h-screen w-full pointer-events-none invisible"></div>
      </div>

      <div className="relative z-20 bg-white">

        {/* Sessão 1 */}
        <section className="w-full px-8 lg:px-30 py-24 md:py-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-semibold text-gray-900">Contexto</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Texto alinhado à esquerda ocupando 1 terço do espaço.
              </p>
            </div>

            <div className="flex flex-col gap-8 md:col-span-2">
              <div className="h-96 w-full bg-gray-100"></div>
              <div className="h-96 w-full bg-gray-100"></div>
              <div className="h-96 w-full bg-gray-100"></div>
            </div>
          </div>

          <div className="mt-16 h-[60vh] w-full bg-gray-200"></div>
        </section>

        {/* Sessão 2 */}
        <section className="w-full px-8 lg:px-30 py-24 md:py-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

            <div className="md:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-3xl font-semibold text-gray-900">Processo</h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Este texto permanece travado na tela enquanto as imagens ao lado
                  rolam livremente.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
              <div className="h-80 bg-gray-100"></div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-medium">Detalhe 01</h3>
                <p className="mt-2 text-gray-600">Descrição correspondente à imagem 1.</p>
              </div>

              <div className="h-80 bg-gray-100"></div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-medium">Detalhe 02</h3>
                <p className="mt-2 text-gray-600">Descrição correspondente à imagem 2.</p>
              </div>

              <div className="h-80 bg-gray-100"></div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-medium">Detalhe 03</h3>
                <p className="mt-2 text-gray-600">Descrição correspondente à imagem 3.</p>
              </div>

              <div className="h-80 bg-gray-100"></div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-medium">Detalhe 04</h3>
                <p className="mt-2 text-gray-600">Descrição correspondente à imagem 4.</p>
              </div>
            </div>
          </div>
        </section>

        {/* NOVA SESSÃO: Imagens pós-Processo */}
        <section className="w-full px-8 lg:px-30 pb-24 md:pb-32">
          <div className="flex flex-col gap-8">
            <div className="h-[70vh] w-full bg-gray-200"></div>
            <div className="h-[70vh] w-full bg-gray-200"></div>
          </div>
        </section>

        {/* Sessão 3 */}
        <section className="w-full px-8 lg:px-30 py-24 md:py-32">
          <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-semibold text-gray-900">Resultados</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
              <p className="text-gray-600 leading-relaxed">
                Primeira coluna de texto ocupando o centro da tela.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Segunda coluna de texto ocupando a extremidade direita.
              </p>
            </div>
          </div>

          {/* AJUSTE: 2 Imagens Finais Empilhadas */}
          <div className="flex flex-col gap-8">
            <div className="h-[70vh] w-full bg-gray-100"></div>
            <div className="h-[70vh] w-full bg-gray-100"></div>
          </div>
        </section>

      </div>
    </main>
  );
}