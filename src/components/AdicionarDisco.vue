<template>
  
<div class="add container">
    <nav class="navbar navbar-light bg-light">
  <span class="navbar-text">
     <router-link :to="{ name: 'dashboard'}">
     <i class="fa fa-reply-all" style="font-size:24px"></i>
     Voltar para tela inicial
     </router-link>
  </span>
</nav>
  <br>
  <h2>Adicionar Disco</h2>
  <br>
   <span v-if="ajaxRequest">Please Wait ...</span>
    <form  class='campos' novalidate @submit.stop.prevent="submit" method="post">

<div class="form-group">
    <label for="yearPublication">Nome da Coleção</label>
<select class="form-control" v-model="id_collection">
<option disabled value="">Escolha uma coleção</option>
  <option  v-for="(item, index) in collections" :key="`item-${index}`"  v-bind:value="item.id_collection">{{item.name_collection}}</option>
</select>
</div>

  <div class="form-group">
    <label for="titleDisk">Título do Disco</label>
    <input type="text" v-model="titleDisk" class="form-control" id="titleDisk" aria-describedby="emailHelp" placeholder="Digite o título do Disco" required>
    
  </div>
  <div class="form-group">
    <label for="yearPublication">Ano de Publicação do Disco</label>
    <input type="text" v-model="yearDisk" class="form-control" id="yearPublication" placeholder="Ano de publicação" required>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
  </div>
  
  
</template>

<script>
import * as CONFIG from '../main'

import moment from 'moment'

export default {
  name: 'add',
  data () {
    return {
      msg: 'Catálogo de Discos',
      titleDisk: '',
      collections: [],
      id_collection:'',
      created:'',
      updated:'',
      yearDisk:'',
      ajaxRequest: false,
      url: CONFIG.HOST_BACKEND+'/api/v1/disk/add',
      urlCollection: CONFIG.HOST_BACKEND+'/api/v1/collection',
      token: window.localStorage.getItem('token')
    }
  },
    mounted: function(){
      this.checkToken();

    }, 
  methods: {
            open() {
      alert(this.feedback);
    },
      checkToken(){
    console.log("token: "+this.token);
    if(this.token!=null){
      this.$http.get(CONFIG.HOST_BACKEND+"/api/v1/user/token",{ headers:{'x-access-token':this.token}}).then(response => {
    console.log("resposta: "+JSON.stringify(response));
     if(response.body.response!==200){
       window.location.href="/";
     } else{
      this.listaColecoes();
     }
 }, response => {
     // error callback
     console.log("ERROR CALLBACK: "+response.body.error);
     this.feedback = "Não foi possível ler as coleções.";
     this.open();
 });
      }else{
       window.location.href="/"; 
      }
},
    listaColecoes(){
//{ headers:{'x-access-token':this.token}}
          this.$http.get(this.urlCollection, { headers:{'x-access-token':this.token}}).then(response => {
               this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.collections = response.body.body;
			          } else{
                          this.feedback = "Não foi possível ler as coleções.";                          
                          console.log("ERROR: "+response.body.error);
                          this.open();
                }
            }, response => {
                // error callback
                console.log("ERROR CALLBACK: "+response.body.error);
                this.feedback = "Não foi possível ler as coleções.";
                this.open();
            });
    },
     submit(){
        if(this.titleDisk.length>4 && this.yearDisk!="" && this.id_collection!=""){
                this.ajaxRequest = true;
                this.created = moment().format('YYYY-MM-DD');
                this.updated = moment().format('YYYY-MM-DD');
       this.$http.post(this.url, {title: this.titleDisk, id_collection:this.id_collection, year:this.yearDisk, created:this.created, updated:this.updated, token:this.token}).then(response => {
    // get body data
    console.log("resposta: "+JSON.stringify(response));
    this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.feedback = "Disco Adicionado com sucesso!";  
                this.open();   
                window.location.href="/dashboard";   
			          } else{
                this.feedback = "Erro ao adicionar disco.";
                this.open();
                window.location.href="/dashboard";
                }
  }, response => {
    // error callback
            console.log(response.body);
                this.feedback = "Não foi possível adicionar disco. Tente mais tarde por favor.";
                this.open();
                window.location.href="/dashboard";
  });

        }else{
            this.feedback = "Preencha todos os campos corretamente!";
            this.open();
        }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.campos{ text-align: left;}
.center{ text-align: center;}
.add{ width: 500px; margin: 10% auto; display: block;}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
