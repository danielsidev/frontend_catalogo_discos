<template>

  <div class="app container">
      <nav class="navbar navbar-light bg-light justify-content-between">
            
            <form class="form-inline" novalidate @submit.stop.prevent="submit" method="post">
              <input class="form-control mr-sm-2" required v-model="keyword" type="search" placeholder="Pesquisar Disco" aria-label="Search">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Pesquisar</button>
            </form>
            <!-- <a class="navbar-brand">Sair</a> -->
            <button type="button" v-on:click="logout()" class="btn btn-danger">Sair </button>
          </nav>
    <h1>Lista de Discos</h1>

    <hr />
    <table class="table table-striped ">
  <thead>
      <tr>
      <th colspan="2" scope="col">
          <router-link :to="{ name: 'dashboard.add'}">
              <button type="button" class="btn btn-success">+ Adicionar Disco</button>
              </router-link></th>
              <th colspan="2" scope="col">
    <label for="yearPublication">Filtrar pela Coleção</label>
<select class="form-control" v-model="id_collection"  @change="listaDiscosFilter()">
<option  value="">Todas as coleções</option>
  <option  v-for="(item, index) in collections" :key="`item-${index}`"  v-bind:value="item.id_collection">{{item.name_collection}}</option>
</select>
              </th>
      
    </tr>
    <tr>
      <th scope="col">Coleção</th>
      <th scope="col">Disco</th>
      <th scope="col">Ano</th>
      <th scope="col">Ação</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, index) in discos" :key="`item-${index}`">
      <td>{{ item.collection }}</td>
      <td>{{ item.disk }}</td>
      <td>{{ item.year }}</td>
      <td>
           <router-link :to="{ name: 'dashboard.edit', params: { id:item.id_disks }}">
             <button type="button" class="btn btn-warning">  Editar </button></router-link>
           |

              <button type="button" v-on:click="deleteDisco(item.id_disks)" class="btn btn-danger">Excluir </button>
        </td>
    </tr>
    
  </tbody>
</table>
<hr />
  </div>
</template>

<script>
import * as CONFIG from '../main'



export default {
  name: 'dashboard',
  data () {
    return {
         sortBy: 'year',
      sortDesc: false,
        campos:[{key:"collection", label:"Coleção"},{key:"disk", label:"Disco"},
        {key:"year", label:"Ano"}],
      discos: [],
      url:CONFIG.HOST_BACKEND+'/api/v1/disk/collection/all',
      urlDelete:CONFIG.HOST_BACKEND+'/api/v1/disk/delete/',
      urlSearch:CONFIG.HOST_BACKEND+"/api/v1/disk/search/keyword/",
      urlFilter:CONFIG.HOST_BACKEND+"/api/v1/disk/collection/all/",
      urlCollection: CONFIG.HOST_BACKEND+'/api/v1/collection',
      urlLogout: CONFIG.HOST_BACKEND+"/api/v1/user/logout",
      token: window.localStorage.getItem('token'),
      keyword:'',
      collections:[],
      id_collection:''
    }
  },
  mounted: function(){
      this.checkToken();

    },  
    methods: {
             open() {
      alert(this.feedback);
    },
    onChange(){
      console.log("Collection: "+this.id_collection);
    },
    checkToken(){
    console.log("token: "+this.token);
    if(this.token!=null){
      this.$http.get(CONFIG.HOST_BACKEND+"/api/v1/user/token",{ headers:{'x-access-token':this.token}}).then(response => {
    console.log("resposta: "+JSON.stringify(response));
     if(response.body.response!==200){
       window.location.href="/";
     } else{
      this.listaDiscos();
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
          this.$http.get(this.urlCollection,{ headers:{'x-access-token':this.token}}).then(response => {
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
    listaDiscosFilter() {
      if(this.id_collection!=""){
        this.$http.get(this.urlFilter+this.id_collection, { headers:{'x-access-token':this.token}}).then(response => {
    // get body data
    console.log("resposta: "+JSON.stringify(response));
    this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.discos = response.body.body;
			          } else{
                this.feedback = "Não existem dicos cadastrados";
                }
  }, response => {
    // error callback
    console.log("ERROR: "+JSON.stringify(response));
  });
      }else{
        this.listaDiscos();
      }

        },
        listaDiscos() {
        this.$http.get(this.url, { headers:{'x-access-token':this.token}}).then(response => {
    // get body data
    console.log("resposta: "+JSON.stringify(response));
    this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.discos = response.body.body;
			          } else{
                this.feedback = "Não existem dicos cadastrados";
                }
  }, response => {
    // error callback
    console.log("ERROR: "+JSON.stringify(response));
  });
        },
        submit() {
          console.log("URL: "+this.urlSearch+this.keyword);
    if(this.keyword!=""){
          this.$http.get(this.urlSearch+this.keyword, { headers:{'x-access-token':this.token}}).then(response => {
      // get body data
      console.log("resposta: "+JSON.stringify(response));
      this.ajaxRequest = false;
                  if(response.body.response===200){
                  console.log("resposta: "+JSON.stringify(response));
                  if(response.body.body.length>0){
                  this.discos = response.body.body;
                  }else{
                    this.feedback = "Não existem dicos com esse nome!";
                    this.open();
                    this.listaDiscos(); 
                  }
                  } else{
                  this.feedback = "Não existem dicos cadastrados";
                  }
    }, response => {
      // error callback
      console.log("ERROR: "+JSON.stringify(response));
    });
  }else{
    this.listaDiscos();
  }
        },
        deleteDisco(id){
          console.log("URL: "+this.urlDelete);
          this.token = 'teste';
            this.$http.delete(this.urlDelete+id,{ headers:{'x-access-token':this.token}}).then(response => {
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.feedback = "Disco Excluído com sucesso!";  
                this.open();   
                window.location.href="/dashboard";   
			          } else{
                this.feedback = "Erro ao excluir o  disco.";
                this.open();
                window.location.href="/dashboard";
                }
  }, response => {
    // error callback
            console.log(response.body);
                this.feedback = "Não foi possível excluir disco. Tente mais tarde por favor.";
                this.open();
                window.location.href="/dashboard";
  });
        },
        logout() {
          console.log("URL: "+this.urlSearch+this.keyword);
          this.$http.post(this.urlLogout, {token: this.token}).then(response => {
      console.log("resposta: "+JSON.stringify(response));
      this.ajaxRequest = false;
                  if(response.body.response===200){
                    window.localStorage.removeItem("token");
                    window.localStorage.clear();
                  window.location.href="/";
                  } else{
                  this.feedback = "Não foi possível fazer logout!";
                  this.open();
                  }
    }, response => {
      // error callback
      console.log("ERROR: "+JSON.stringify(response));
    });
  
        },
    }
}
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

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
