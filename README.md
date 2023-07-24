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

Recomendamos utilizar uma distribuição Linux baseada em Ubuntu
### Node

Atualize os pacotes apt
~~~bash
$ sudo apt update
~~~

Instale o Node
~~~bash
$ sudo apt install nodejs
~~~

Instale o gerenciador de pacotes
~~~bash
$ sudo apt install npm 
~~~

### Docker 

Remova todos os possíveis conflitos
~~~bash
$ for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
~~~

Atualize os pacotes apt
~~~bash
$ sudo apt-get update
$ sudo apt-get install ca-certificates curl gnupg
~~~

Adicione a chave GPG oficial do Docker 
~~~bash
$ sudo install -m 0755 -d /etc/apt/keyrings

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

$ sudo chmod a+r /etc/apt/keyrings/docker.gpg
~~~

Use o seguinte comando para setar o repositório
~~~bash
$ echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
~~~

**Instalando a Docker Engine**

Atualizando os pacotes
~~~bash
$ sudo apt-get update
~~~

Instalando a versão mais recente
~~~bash
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
~~~

Verifique a instalação
~~~bash
$ sudo docker run hello-world
~~~

### Docker Compose

~~~bash
$ sudo apt-get update
$ sudo apt-get install docker-compose-plugin
~~~

### Executando o projeto

Dentro da pasta(_root_) do projeto execute o comando abaixo para instalar as dependências do Node
~~~bash
$ npm install
~~~

A seguir inicie o projeto via Docker
~~~bash
$ sudo docker-compose up --build //se for a primeira execução

ou

$ sudo docker-compose up 
~~~