<template>
  
<div id="login">
  <h1>Catálogo de Discos</h1>
  <br>
  <h2>Login</h2>
  <br>
   <span v-if="ajaxRequest">Please Wait ...</span>
    <form novalidate @submit.stop.prevent="submit" method="post">
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" v-model="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Digite o e-mail" required>
    
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" v-model="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
  </div>
  
  
</template>

<script>
import * as CONFIG from '../main'


export default {
  name: 'app',
  data () {
    return {
      msg: 'Catálogo de Discos',
      email: '',
      password: '',
      ajaxRequest: false,
      feedback:'',
      vertical: 'bottom',
      horizontal: 'center',
      duration: 4000,
      url:CONFIG.HOST_BACKEND+'/api/v1/user/login',
      token:''
    }
  },
  
  methods: {
            open() {
      alert(this.feedback);
    },
     submit(){
        if(this.email.length>4 && this.senha!=""){
                this.ajaxRequest = true;
       this.$http.post(this.url, {email: this.email, password:this.password}).then(response => {
    // get body data
    console.log("resposta: "+JSON.stringify(response));
    this.ajaxRequest = false;
                if(response.body.response===200){
                console.log("resposta: "+JSON.stringify(response));
                this.token = response.body.token;
				        this.entrar();
			          } else{
                this.feedback = "Usuário ou senha inválido!";
                this.open();
                }
  }, response => {
    // error callback
            console.log(response.body);
                this.feedback = "Não foi possível fazer login. Tente mais tarde por favor.";
                this.open();
  });

        }else{
            this.feedback = "Preencha todos os campos corretamente!";
            this.open();
        }
    },
         entrar(){
             window.localStorage.setItem('token', this.token);
             window.location.href="/dashboard";
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
#login{ width: 500px; margin: 10% auto; display: block;}

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
