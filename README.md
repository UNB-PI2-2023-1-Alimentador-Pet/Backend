# Miaufeeder API

O Miaufeeder é um dispositivo que tem como objetivo alimentar com
ração um _pet_ de forma remota, sendo controlado via aplicativo 
ou por comando via [Alexa](https://www.amazon.com.br/b?ie=UTF8&node=19949683011). 

Esse repositório contém os códigos referentes à API da aplicação
para dispositivos móveis do Miaufeeder.
## Heroku

O [Heroku](https://www.heroku.com/platform) é uma plataforma de 
Clouding onde é possível armazenar uma API na nuvem de forma que ela esteja acessível via internet sem a necessidade de configuração manual de uma máquina física.

Nesse projeto, o Heroku foi utilizado para armazenar o banco de dados Postgres e a API, observando diretamente o repositório _Miaufeeder Backend_ na branch Develop, de forma que automaticamente a cada atualização do código a API se atualiza.

## Dependências

O projeto foi desenvolvido na linguagem _Javascript_ e utiliza o [NodeJs](https://nodejs.org/en/about) via **npm** para organizar e interpretar a linguagem para a construção de uma API funcional.

O projeto também utiliza o banco de dados relacional [PostgresSql](https://www.postgresql.org/) para organizar os dados armazenados no sistema.

Para facilitar o desenvolvimento colaborativo visando sanar os problemas de incompatibilidade do ambiente de desenvolvimento, utilizamos o [Docker](https://www.docker.com/) para criar o _Container_ e o [Docker Compose](https://docs.docker.com/compose/) para executar os múltiplos _Containers_ do projeto.
## Instalação
