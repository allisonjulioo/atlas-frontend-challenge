<?php

declare(strict_types=1);

namespace Atlas\Api\Seed;

final class SeedData
{
    public const int TOTAL = 520;
    public const int SEED = 20260920;
    public const int FEMALE_NAME_COUNT = 24;

    /** @return list<string> */
    public static function firstNames(): array
    {
        return [
            'Ana', 'Beatriz', 'Camila', 'Daniela', 'Eduarda', 'Fernanda', 'Gabriela', 'Helena',
            'Isabela', 'Juliana', 'Larissa', 'Mariana', 'Natália', 'Patrícia', 'Rafaela', 'Tatiane',
            'Vanessa', 'Yasmin', 'Carla', 'Débora', 'Elaine', 'Priscila', 'Renata', 'Simone',
            'André', 'Bruno', 'Caio', 'Diego', 'Eduardo', 'Felipe', 'Gustavo', 'Henrique',
            'Igor', 'João', 'Lucas', 'Marcelo', 'Nelson', 'Otávio', 'Paulo', 'Rodrigo',
            'Thiago', 'Vinícius', 'Wagner', 'Alexandre', 'Cristiano', 'Fábio', 'Leandro', 'Ricardo',
        ];
    }

    /** @return list<string> */
    public static function lastNames(): array
    {
        return [
            'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
            'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
            'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Moreira',
            'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Gonçalves',
        ];
    }

    /** @return list<array{0: string, 1: string}> */
    public static function locations(): array
    {
        return [
            ['São Paulo', 'SP'], ['Campinas', 'SP'], ['Santo André', 'SP'], ['Guarulhos', 'SP'], ['Osasco', 'SP'],
            ['Rio de Janeiro', 'RJ'], ['Niterói', 'RJ'], ['Belo Horizonte', 'MG'], ['Contagem', 'MG'],
            ['Curitiba', 'PR'], ['Porto Alegre', 'RS'], ['Florianópolis', 'SC'], ['Joinville', 'SC'],
            ['Salvador', 'BA'], ['Recife', 'PE'], ['Fortaleza', 'CE'], ['Brasília', 'DF'], ['Goiânia', 'GO'],
        ];
    }

    /** @return list<string> */
    public static function reviewComments(): array
    {
        return [
            'Pontual, explicou tudo antes de começar e deixou o serviço impecável.',
            'Resolveu em uma visita o que outro profissional não resolveu em três.',
            'Preço justo e acabamento muito acima do que eu esperava.',
            'Atendimento atencioso, tirou todas as minhas dúvidas pelo chat antes.',
            'Chegou no horário combinado e cuidou da limpeza depois do serviço.',
            'Já é a terceira vez que contrato. Confio de olhos fechados.',
            'Ótimo profissional, mas demorou um pouco para confirmar a data.',
            'Trabalho caprichado. Recomendo para quem se importa com detalhe.',
            'Comunicação clara do início ao fim e orçamento sem surpresa.',
            'Super indico. Discreto, organizado e muito técnico no que faz.',
        ];
    }

    /** @return list<string> */
    public static function bioOpeners(): array
    {
        return [
            'Atuo há %Y anos atendendo %C e região',
            'Sou %P com %Y anos de estrada, atendendo principalmente %C',
            'Comecei como autônomo há %Y anos e hoje atendo %C e cidades vizinhas',
        ];
    }

    /** @return list<string> */
    public static function bioBody(): array
    {
        return [
            'Trabalho com orçamento fechado antes de iniciar: você aprova o escopo e o valor não muda no meio do caminho.',
            'Prefiro resolver a causa e não só o sintoma, mesmo que isso signifique uma visita técnica a mais.',
            'Levo ferramenta e material básico inclusos, e informo antes qualquer item que precise ser comprado à parte.',
            'Atendo de segunda a sábado, com encaixe para urgência no mesmo dia quando a agenda permite.',
            'Gosto de deixar o cliente acompanhar o processo e explico cada etapa em linguagem simples.',
        ];
    }

    /** @return list<string> */
    public static function bioClosers(): array
    {
        return [
            'Ofereço garantia de 90 dias sobre o serviço executado.',
            'Emito nota fiscal e aceito pix, cartão e parcelamento.',
            'Mais de %J serviços concluídos pela plataforma, com nota média %R.',
            'Se algo não ficar como combinado, volto sem cobrar a visita.',
        ];
    }

    /** @return list<array<string, mixed>> */
    public static function professions(): array
    {
        return [
            ['title' => 'Eletricista', 'category' => 'casa', 'rate' => [70, 180],
                'headlines' => ['Instalações e emergências 24h', 'Quadros, tomadas e automação residencial', 'Laudo e adequação de norma'],
                'services' => [['Instalação de tomada', 'serviço', 90], ['Troca de quadro de luz', 'serviço', 480], ['Chamado de emergência', 'hora', 160]]],
            ['title' => 'Encanador', 'category' => 'casa', 'rate' => [70, 160],
                'headlines' => ['Caça-vazamento sem quebrar parede', 'Desentupimento e reparos hidráulicos', 'Atendimento no mesmo dia'],
                'services' => [['Caça-vazamento', 'serviço', 350], ['Desentupimento', 'serviço', 220], ['Troca de registro', 'serviço', 140]]],
            ['title' => 'Pintor', 'category' => 'casa', 'rate' => [45, 120],
                'headlines' => ['Acabamento fino e textura', 'Pintura residencial e comercial', 'Massa corrida e grafiato'],
                'services' => [['Pintura de parede', 'm²', 28], ['Textura decorativa', 'm²', 45], ['Pintura completa', 'diária', 380]]],
            ['title' => 'Diarista', 'category' => 'casa', 'rate' => [35, 90],
                'headlines' => ['Limpeza pesada e organização', 'Pós-obra e faxina completa', 'Rotina semanal com produtos inclusos'],
                'services' => [['Faxina completa', 'diária', 240], ['Limpeza pós-obra', 'diária', 360], ['Organização de armários', 'hora', 70]]],
            ['title' => 'Marceneiro', 'category' => 'casa', 'rate' => [90, 240],
                'headlines' => ['Móveis planejados sob medida', 'Restauro de madeira maciça', 'Projeto 3D antes da execução'],
                'services' => [['Projeto sob medida', 'serviço', null], ['Restauro de móvel', 'serviço', 650], ['Montagem', 'hora', 120]]],
            ['title' => 'Montador de móveis', 'category' => 'casa', 'rate' => [50, 130],
                'headlines' => ['Montagem no mesmo dia', 'Desmontagem e remontagem em mudança', 'Ferramenta própria e garantia'],
                'services' => [['Montagem de guarda-roupa', 'serviço', 220], ['Montagem de cozinha', 'serviço', 480], ['Hora avulsa', 'hora', 95]]],
            ['title' => 'Jardineiro', 'category' => 'casa', 'rate' => [45, 130],
                'headlines' => ['Paisagismo e manutenção de jardim', 'Poda técnica e irrigação', 'Jardim vertical e horta urbana'],
                'services' => [['Manutenção mensal', 'serviço', 320], ['Poda de árvore', 'serviço', 280], ['Projeto de paisagismo', 'serviço', null]]],
            ['title' => 'Cabeleireiro', 'category' => 'beleza', 'rate' => [60, 260],
                'headlines' => ['Corte, coloração e tratamento', 'Loiros e correção de cor', 'Atendimento em domicílio'],
                'services' => [['Corte feminino', 'serviço', 120], ['Coloração completa', 'serviço', 380], ['Hidratação', 'serviço', 95]]],
            ['title' => 'Barbeiro', 'category' => 'beleza', 'rate' => [40, 140],
                'headlines' => ['Corte clássico e barba desenhada', 'Barbearia em domicílio', 'Pigmentação e navalhado'],
                'services' => [['Corte + barba', 'serviço', 85], ['Barba completa', 'serviço', 45], ['Pigmentação', 'serviço', 120]]],
            ['title' => 'Manicure', 'category' => 'beleza', 'rate' => [35, 120],
                'headlines' => ['Alongamento em fibra e gel', 'Nail art autoral', 'Esmaltação em gel de longa duração'],
                'services' => [['Mão e pé', 'serviço', 70], ['Alongamento em gel', 'serviço', 180], ['Manutenção', 'serviço', 110]]],
            ['title' => 'Maquiador', 'category' => 'beleza', 'rate' => [90, 400],
                'headlines' => ['Noivas e madrinhas', 'Maquiagem para ensaio e evento', 'Pele madura e prova de longa duração'],
                'services' => [['Maquiagem social', 'serviço', 220], ['Noiva + prova', 'serviço', 850], ['Aula de automaquiagem', 'hora', 180]]],
            ['title' => 'Esteticista', 'category' => 'beleza', 'rate' => [70, 230],
                'headlines' => ['Limpeza de pele profunda', 'Protocolos faciais e corporais', 'Avaliação e plano de tratamento'],
                'services' => [['Limpeza de pele', 'serviço', 180], ['Drenagem linfática', 'serviço', 140], ['Peeling', 'serviço', 260]]],
            ['title' => 'Personal trainer', 'category' => 'bem-estar', 'rate' => [70, 220],
                'headlines' => ['Treino individualizado em casa ou parque', 'Emagrecimento e recomposição', 'Acompanhamento com planilha'],
                'services' => [['Aula avulsa', 'hora', 120], ['Plano mensal 3x', 'serviço', 720], ['Avaliação física', 'serviço', 150]]],
            ['title' => 'Massoterapeuta', 'category' => 'bem-estar', 'rate' => [80, 240],
                'headlines' => ['Massagem relaxante e terapêutica', 'Liberação miofascial', 'Atendimento com maca própria'],
                'services' => [['Relaxante 60 min', 'serviço', 180], ['Terapêutica 90 min', 'serviço', 260], ['Pacote 4 sessões', 'serviço', 640]]],
            ['title' => 'Fisioterapeuta', 'category' => 'bem-estar', 'rate' => [110, 320],
                'headlines' => ['Reabilitação pós-cirúrgica', 'Pilates clínico e RPG', 'Domiciliar para idosos'],
                'services' => [['Sessão individual', 'hora', 180], ['Pacote 10 sessões', 'serviço', 1600], ['Avaliação postural', 'serviço', 220]]],
            ['title' => 'Nutricionista', 'category' => 'bem-estar', 'rate' => [100, 300],
                'headlines' => ['Plano alimentar sem dieta restritiva', 'Nutrição esportiva', 'Consulta online ou presencial'],
                'services' => [['Primeira consulta', 'serviço', 280], ['Retorno', 'serviço', 180], ['Plano trimestral', 'serviço', 720]]],
            ['title' => 'Instrutor de yoga', 'category' => 'bem-estar', 'rate' => [60, 190],
                'headlines' => ['Hatha e vinyasa para iniciantes', 'Aulas em grupo no parque', 'Respiração e meditação guiada'],
                'services' => [['Aula individual', 'hora', 130], ['Aula em dupla', 'hora', 180], ['Plano mensal', 'serviço', 420]]],
            ['title' => 'Desenvolvedor front-end', 'category' => 'tecnologia', 'rate' => [120, 420],
                'headlines' => ['Interfaces em Vue e Nuxt', 'Performance e Core Web Vitals', 'Design system e componentização'],
                'services' => [['Consultoria técnica', 'hora', 260], ['Landing page', 'serviço', null], ['Auditoria de performance', 'serviço', 1800]]],
            ['title' => 'Designer de produto', 'category' => 'tecnologia', 'rate' => [110, 380],
                'headlines' => ['UX research e prototipação', 'Design system do zero', 'Discovery e testes de usabilidade'],
                'services' => [['Sprint de discovery', 'serviço', null], ['Protótipo navegável', 'serviço', 3200], ['Consultoria', 'hora', 240]]],
            ['title' => 'Técnico de informática', 'category' => 'tecnologia', 'rate' => [60, 180],
                'headlines' => ['Formatação, upgrade e recuperação', 'Atendimento em domicílio', 'Redes e Wi-Fi mesh'],
                'services' => [['Formatação', 'serviço', 150], ['Upgrade de SSD', 'serviço', 180], ['Instalação de rede', 'hora', 130]]],
            ['title' => 'Fotógrafo', 'category' => 'eventos', 'rate' => [150, 600],
                'headlines' => ['Ensaios e eventos', 'Casamento com segundo fotógrafo', 'Entrega em até 15 dias'],
                'services' => [['Ensaio 1h', 'serviço', 650], ['Cobertura de evento', 'hora', 350], ['Casamento completo', 'serviço', null]]],
            ['title' => 'Videomaker', 'category' => 'eventos', 'rate' => [160, 650],
                'headlines' => ['Vídeo institucional e social', 'Captação com drone', 'Roteiro, captação e edição'],
                'services' => [['Reels', 'serviço', 800], ['Cobertura com drone', 'diária', 1800], ['Edição avulsa', 'hora', 220]]],
            ['title' => 'DJ', 'category' => 'eventos', 'rate' => [180, 700],
                'headlines' => ['Casamentos e festas particulares', 'Som e iluminação inclusos', 'Setlist montado com o cliente'],
                'services' => [['Festa 4h', 'serviço', 1600], ['Hora adicional', 'hora', 320], ['Som + iluminação', 'serviço', null]]],
            ['title' => 'Chef de cozinha', 'category' => 'eventos', 'rate' => [150, 520],
                'headlines' => ['Jantar harmonizado em casa', 'Menu autoral para até 20 pessoas', 'Compras, execução e limpeza'],
                'services' => [['Jantar para 2', 'serviço', 780], ['Jantar para 10', 'serviço', 2400], ['Aula de culinária', 'hora', 280]]],
            ['title' => 'Professor de inglês', 'category' => 'educacao', 'rate' => [60, 220],
                'headlines' => ['Conversação e preparação para entrevista', 'Material próprio e plano individual', 'Aulas online ou presenciais'],
                'services' => [['Aula individual', 'hora', 120], ['Pacote 8 aulas', 'serviço', 860], ['Aula em dupla', 'hora', 160]]],
            ['title' => 'Professor de matemática', 'category' => 'educacao', 'rate' => [55, 180],
                'headlines' => ['Reforço escolar e pré-vestibular', 'ENEM e cálculo I', 'Plano de estudos acompanhado'],
                'services' => [['Aula particular', 'hora', 100], ['Pacote mensal', 'serviço', 360], ['Monitoria de véspera', 'hora', 150]]],
            ['title' => 'Professor de música', 'category' => 'educacao', 'rate' => [70, 220],
                'headlines' => ['Violão, guitarra e teoria musical', 'Aulas para iniciantes e retomada', 'Repertório escolhido pelo aluno'],
                'services' => [['Aula individual', 'hora', 130], ['Pacote 4 aulas', 'serviço', 460], ['Aula experimental', 'serviço', null]]],
        ];
    }
}
