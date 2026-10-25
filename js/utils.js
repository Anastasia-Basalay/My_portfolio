// Общие мелкие функции, которыми пользуются все остальные файлы.

const $ = (id) => document.getElementById(id);

const tagsHtml = (list) => `<div class="tags">${list.map((t) => `<i>${t}</i>`).join("")}</div>`;

const linkButton = ({ label, href }) =>
  `<a class="btn" href="${href}" target="_blank" rel="noreferrer">${label}</a>`;
