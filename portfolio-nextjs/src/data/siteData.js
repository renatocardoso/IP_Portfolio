// ─────────────────────────────────────────────────────────────────────────────
// Central de dados editáveis do website Infinita Poesia
// ─────────────────────────────────────────────────────────────────────────────

// Palavras que aparecem na animação de digitação da página inicial.
// Edite, adicione ou remova palavras para alterar a animação.
export const typewriterWords = [
    "infinita poesia",
    "marcas",
    "produtos",
    "design",
    "criatividade",
    "arte",
    "identidade",
    "marcas",
    "cultura",
    "design",
    "produtos",
    "ideias"
];

// Tags de filtro da página de projetos.
// Edite os labels ou adicione novos objetos { label, value } para criar novas tags.
// O campo "value" deve coincidir com o campo "category" dos projetos em projetos/page.js.
export const filterTags = {
    pt: [
        { label: "Todos", value: "todos" },
        { label: "Gráfico", value: "grafico" },
        { label: "Produto", value: "produto" },
        { label: "Identidade Visual", value: "identidade-visual" },
        { label: "Digital", value: "digital" },
        { label: "Embalagem", value: "embalagem" },
        { label: "Editorial", value: "editorial" },
    ],
    en: [
        { label: "All", value: "todos" },
        { label: "Graphic", value: "grafico" },
        { label: "Product", value: "produto" },
        { label: "Visual Identity", value: "identidade-visual" },
        { label: "Digital", value: "digital" },
        { label: "Packaging", value: "embalagem" },
        { label: "Editorial", value: "editorial" },
    ],
};
