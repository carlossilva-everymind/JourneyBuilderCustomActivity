const path = require('path');
const fs = require('fs');

/**
 * Render Config
 * @param req
 * @param res
 */
exports.config = (req, res) => {
  const domain = req.headers.host || req.headers.origin;
  const file = path.join(__dirname, '..', 'public', 'config-template.json');

  const configTemplate = fs.readFileSync(file, 'utf-8');
  const config = JSON.parse(configTemplate.replace(/\$DOMAIN/g, domain));
  res.json(config);
};

/* Exportação do ui, utilizado na rota '/' (app.js)
 * Aqui é renderizado a view index passando alguns atributos, para que a view engine 
 * neste caso pug, crie o HTML
 */
/**
 * Render UI
 * @param req
 * @param res
 */
exports.ui = (req, res) => {
  res.render('index', {
    title: 'Confirmação de Agendamento no Motion',
    dropdownOptions: [
      {
        name: 'CONFIRMADO',
        value: 'CONFIRMADO',
      },
      {
        name: 'CANCELADO',
        value: 'CANCELADO',
      },
    ],
  });
};
