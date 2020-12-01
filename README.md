# [Si9 Sistemas - Software para Imobiliárias](https://si9sistemas.com.br)

[API de Leads Si9 Sistemas](https://github.com/si9sistemas/api-example-js) projeto exemplo para implementação da API de recepção de Leads, possibilita integração com terceiros e recepção de leads vindos diretamente do site.

## Status

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackrockDigital/startbootstrap-landing-page/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/startbootstrap-landing-page.svg)](https://www.npmjs.com/package/startbootstrap-landing-page)
[![Build Status](https://travis-ci.org/BlackrockDigital/startbootstrap-landing-page.svg?branch=master)](https://travis-ci.org/BlackrockDigital/startbootstrap-landing-page)
[![dependencies Status](https://david-dm.org/BlackrockDigital/startbootstrap-landing-page/status.svg)](https://david-dm.org/BlackrockDigital/startbootstrap-landing-page)
[![devDependencies Status](https://david-dm.org/BlackrockDigital/startbootstrap-landing-page/dev-status.svg)](https://david-dm.org/BlackrockDigital/startbootstrap-landing-page?type=dev)

## Download and Installation

Clone o projeto para configuração e personalização 
* Clone the repo: [Download](https://github.com/si9sistemas/api-example-js)
* Install GULP: `npm i gulp -g`
* Install NPM: `npm install`
* Run Dev: `npm start`

## Usage
* O arquivo `/src/js/core-leads.js` foi preparado para trabalhar como dependencia do arquivo `/src/js/new-lead.js`
* Não sendo necessário compreender o funcionamento do arquivo de CORE, utilize para personalizações avançadas
* Faça suas configurações e personalizações diretamente no arquivo `/src/js/new-lead.js`
* Quando você personaliza os arquivos e roda o comando  `npm start` o GULP irá compilar e minificar ambos arquivos, deste modo você pode realizar todas configurações e testes usando este projeto e quando finalizar poderá apenas copiar e colar os arquivos minificados  `/src/js/core-leads.min.js` e `/src/js/new-lead.min.js`
* Outro detalhe importante será inserido apenas um arquivo ao site o `new-lead.js` o `core-leads` será importado diretamente de dentro do arquivo `new-lead.js`
* Insira o arquivo `new-lead` definindo ele como arquivo de módulo Javascript para manter seu funcionamento como descrito na etapa acima.
* INSIRA O ARQUIVO CONFORME ESTE EXEMPLO: `<script src="./js/new-lead.min.js" type="module"></script>`

## Copyright and License

Copyright 2009-2021 Si9 Sistemas.
