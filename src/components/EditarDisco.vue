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
  <h2>Atualizar Disco</h2>
  <br>
   <span v-if="ajaxRequest">Please Wait ...</span>
    <form  class='campos' novalidate @submit.stop.prevent="submit" method="post">

<div class="form-group">
    <label for="yearPublication">Nome da Coleção</label>
<select class="form-control" v-model="id_collection"  >
<option disabled value="">Escolha uma coleção</option>
  <option  v-for="(item, index) in collections" :key="`item-${index}`"  v-bind:value="item.id_collection" 
  :selected="(item.id_collection==id_collection)?true:false" >{{item.name_collection}}</option>
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
  name: 'edit',
  data () {
    return {
      msg: 'Catálogo de Discos',
      titleDisk: '',
      collections: [],
      id_collection:'',
      id_disks: '' ,
      created:'',
      updated:'',
      yearDisk:'',
      ajaxRequest: false,
      url: CONFIG.HOST_BACKEND+'/api/v1/disk/update',
      urlCollection: CONFIG.HOST_BACKEND+'/api/v1/collection',
      urlList: CONFIG.HOST_BACKEND+'/api/v1/disk/',
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
      this.listaDisco();
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
    listaDisco(){
      this.id_disks = this.$route.params.id;
          this.$http.get(this.urlList+this.id_disks).then(response => {
               this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta disco: "+JSON.stringify(response));
                this.id_collection = response.body.body[0].id_collection;
                this.titleDisk = response.body.body[0].disk;
                this.yearDisk = response.body.body[0].year;
                this.listaColecoes();
                //document.getElementById("collection").options[this.id_collection].selected = 'selected';
			          } else{
                          this.feedback = "Não foi possível ler os dados do disco.";                          
                          console.log("ERROR: "+response.body.error);
                          this.open();
                }
            }, response => {
                // error callback
                console.log("ERROR CALLBACK: "+response.body.error);
                this.feedback = "Não foi possível ler ler os dados do disco.";
                this.open();
            });
    },
    listaColecoes(){
//{ headers:{'x-access-token':this.token}}
          this.$http.get(this.urlCollection).then(response => {
            console.log("resposta coleções: "+JSON.stringify(response));
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
       this.$http.put(this.url, {title: this.titleDisk,id_disks:this.id_disks, id_collection:this.id_collection, year:this.yearDisk,  updated:this.updated, token:this.token}).then(response => {
    // get body data
    console.log("resposta: "+JSON.stringify(response));
    this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.feedback = "Disco Atualizado com sucesso!";  
                this.open();   
                window.location.href="/dashboard";   
			          } else{
                this.feedback = "Erro ao atualizar disco.";
                this.open();
                window.location.href="/dashboard";
                }
  }, response => {
    // error callback
            console.log(response.body);
                this.feedback = "Não foi possível atualizar disco. Tente mais tarde por favor.";
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
